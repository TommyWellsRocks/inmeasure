import "server-only";

import { db } from "~/server/db";
import { connectionEntries } from "../../schema";

export async function authorizeAndCreateConnection(
  domain: string,
  apiKey: string,
) {
  const authResponse = await db.transaction(async (tx) => {
    // GetOrganization
    const org = await tx.query.organizations.findFirst({
      columns: { id: true, connectionLimit: true, sessionRecordingLimit: true },
      where: (model, { and, eq }) =>
        and(eq(model.apiKey, apiKey), eq(model.domain, domain)),
      with: {
        totals: {
          columns: {
            standardConnectionScriptsSent: true,
            sessionRecordingScriptsSent: true,
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
      const orgTotals = org.totals?.at(0) ? org.totals[0] : null;
      const connectionId = connectionEntry.connectionId;
      const returnStandardScript =
        !orgTotals ||
        orgTotals.standardConnectionScriptsSent < org.connectionLimit;
      const returnRecordingScript =
        !orgTotals ||
        orgTotals.sessionRecordingScriptsSent < org.sessionRecordingLimit;

      const scripts = {
        returnStandardScript,
        returnRecordingScript,
      };

      return { scripts, connectionId };
    }
  });

  return authResponse;
}
