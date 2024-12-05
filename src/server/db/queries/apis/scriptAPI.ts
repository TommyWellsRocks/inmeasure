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
  const response = { responseStatus: 200, responseMessage: "" };
  const res = await db.transaction(async (tx) => {
    // GetOrganization
    const org = await tx.query.organizations
      .findFirst({
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
      })
      .catch((err) => {
        console.error(
          `ScriptAPI - getOrg Authorization Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}.`,
        );
        response.responseStatus = 500;
      });

    if (org) {
      let connectionId = "";
      // Create the connection

      try {
        const [newConnectionEntry] = await tx
          .insert(connectionEntries)
          .values({
            organizationId: org.id,
          })
          .returning({ connectionId: connectionEntries.connectionId });
        connectionId = newConnectionEntry!.connectionId;
      } catch (err: any) {
        console.error(
          `ScriptAPI - Insert Connection Entry Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}.`,
        );
        response.responseStatus = 500;
      }
      const orgTotals = org.totals[0] ? org.totals[0] : null;

      let scriptType: ReturnScript | null = null;
      const monthlyStandardScriptSent = orgTotals?.standardScriptsSent || 0;
      const monthlyPlaybackScriptSent = orgTotals?.playbackScriptsSent || 0;

      if (
        monthlyPlaybackScriptSent < org.playbackScriptLimit &&
        monthlyStandardScriptSent < org.standardScriptLimit
      ) {
        scriptType = "standardAndPlaybackScript";
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
          })
          .catch((err) => {
            console.error(
              `ScriptAPI - Insert Totals ${scriptType} Script Message Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
            );
            response.responseStatus = 500;
          });
      } else if (monthlyPlaybackScriptSent < org.playbackScriptLimit) {
        scriptType = "playbackScript";
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
          })
          .catch((err) => {
            console.error(
              `ScriptAPI - Insert Totals ${scriptType} Script Message Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
            );
            response.responseStatus = 500;
          });
      } else if (monthlyStandardScriptSent < org.standardScriptLimit) {
        scriptType = "standardScript";
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
          })
          .catch((err) => {
            console.error(
              `ScriptAPI - Insert Totals ${scriptType} Script Message Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
            );
            response.responseStatus = 500;
          });
      }

      return { scriptType, connectionId };
    } else {
      console.warn(
        `ScriptAPI - Illegal Organization Attempt. Domain: ${domain}, APIKEY: ${apiKey}.`,
      );
      response.responseStatus = 403;
    }
  });

  return { res, ...response };
}
