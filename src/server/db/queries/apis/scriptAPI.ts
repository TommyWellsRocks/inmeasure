import "server-only";

import { db } from "~/server/db";
import { connectionEntries } from "../../schema";
import type { ReturnScript } from "~/server/types/scripts";

export async function authorizeAndCreateConnection(
  domain: string,
  apiKey: string,
) {
  const authResponse = await db.transaction(async (tx) => {
    // GetOrganization
    const org = await tx.query.organizations.findFirst({
      columns: {
        id: true,
        standardScriptLimit: true,
        playbackScriptLimit: true,
      },
      where: (model, { and, eq }) =>
        and(eq(model.apiKey, apiKey), eq(model.domain, domain)),
      with: {
        totals: {
          columns: {
            standardScriptsSent: true,
            playbackScriptsSent: true,
          },
          where: (model, { sql }) =>
            sql`${model.month} = date_trunc('month', CURRENT_DATE)`,
          limit: 1,
        },
      },
    });
    if (org) {
      // Create the connection
      const newConnectionEntries = await tx
        .insert(connectionEntries)
        .values({
          organizationId: org.id,
        })
        .returning({ connectionId: connectionEntries.connectionId });

      const connectionEntry = newConnectionEntries.at(0)!;
      const orgTotals = org.totals[0] ? org.totals[0] : null;
      const connectionId = connectionEntry.connectionId;

      let scriptType: ReturnScript | null = null;
      const monthlyStandardScriptSent = orgTotals?.standardScriptsSent || 0;
      const monthlyPlaybackScriptSent = orgTotals?.playbackScriptsSent || 0;

      if (
        monthlyPlaybackScriptSent < org.playbackScriptLimit &&
        monthlyStandardScriptSent < org.standardScriptLimit
      ) {
        scriptType = "standardAndPlaybackScript";
      } else if (monthlyPlaybackScriptSent < org.playbackScriptLimit) {
        scriptType = "playbackScript";
      } else if (monthlyStandardScriptSent < org.standardScriptLimit) {
        scriptType = "standardScript";
      }

      return { scriptType, connectionId };
    }
  });

  return authResponse;
}
