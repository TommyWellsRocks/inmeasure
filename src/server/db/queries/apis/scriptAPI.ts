import "server-only";

import { db } from "~/server/db";
import { connectionEntries, totalsTable } from "../../schema";
import type { ReturnScript } from "~/server/types/scripts";
import { sql } from "drizzle-orm";

export async function authorizeAndCreateConnection(
  domain: string,
  apiKey: string,
) {
  const currentYearMonth = `${new Date().getUTCFullYear()}, ${new Date().getUTCMonth() + 1}`;
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
          where: (model, { eq }) => eq(model.yearAndMonth, currentYearMonth),
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
        await tx
          .insert(totalsTable)
          .values({
            organizationId: org.id,
            yearAndMonth: currentYearMonth,
            connections: 1,
            standardScriptsSent: 1,
            playbackScriptsSent: 1,
          })
          .onConflictDoUpdate({
            target: [totalsTable.organizationId, totalsTable.yearAndMonth],
            set: {
              connections: sql`${totalsTable.connections} + 1`,
              standardScriptsSent: sql`${totalsTable.standardScriptsSent} + 1`,
              playbackScriptsSent: sql`${totalsTable.playbackScriptsSent} + 1`,
            },
          });
        scriptType = "standardAndPlaybackScript";
      } else if (monthlyPlaybackScriptSent < org.playbackScriptLimit) {
        await tx
          .insert(totalsTable)
          .values({
            organizationId: org.id,
            yearAndMonth: currentYearMonth,
            connections: 1,
            playbackScriptsSent: 1,
          })
          .onConflictDoUpdate({
            target: [totalsTable.organizationId, totalsTable.yearAndMonth],
            set: {
              connections: sql`${totalsTable.connections} + 1`,
              playbackScriptsSent: sql`${totalsTable.playbackScriptsSent} + 1`,
            },
          });
        scriptType = "playbackScript";
      } else if (monthlyStandardScriptSent < org.standardScriptLimit) {
        await tx
          .insert(totalsTable)
          .values({
            organizationId: org.id,
            yearAndMonth: currentYearMonth,
            connections: 1,
            standardScriptsSent: 1,
          })
          .onConflictDoUpdate({
            target: [totalsTable.organizationId, totalsTable.yearAndMonth],
            set: {
              connections: sql`${totalsTable.connections} + 1`,
              standardScriptsSent: sql`${totalsTable.standardScriptsSent} + 1`,
            },
          });
        scriptType = "standardScript";
      }

      return { scriptType, connectionId };
    }
  });

  return authResponse;
}
