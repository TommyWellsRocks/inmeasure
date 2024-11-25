import "server-only";

import { db } from "~/server/db";
import { getOrg } from "../helpers/getOrg";
import { durationMessages, pageURLEntries } from "../../schema";

import type { DurationMessage } from "~/server/types/scripts";

export async function authorizeAndWriteMessage(
  data: DurationMessage,
  domain: string,
  apiKey: string,
  connectionId: string,
) {
  const response = { responseStatus: 201, responseMessage: "" };
  await db.transaction(async (dbPen) => {
    // Get the organizationId where isOrganization and isConnectionId
    const organization = await getOrg(
      dbPen,
      domain,
      apiKey,
      connectionId,
    ).catch((err) => {
      console.error(
        `DurationAPI - getOrg Authorization Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 500;
    });

    const organizationId = organization?.id;
    if (organizationId) {
      // Insert Duration Message
      const durationMessage = dbPen
        .insert(durationMessages)
        .values({ connectionId, organizationId, timestamp: data.timestamp })
        .catch((err) => {
          console.error(
            `DurationAPI - Insert Duration Message Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      const pageMessageValues = data.pageURL
        .filter((entry) => entry.url)
        .map((entry) => ({
          connectionId,
          organizationId,
          pageURL: entry.url,
          perfTimestamp: String(entry.perfTimestamp),
        }));

      // Insert PageURL Messages
      const pageMessages = dbPen
        .insert(pageURLEntries)
        .values(pageMessageValues)
        .catch((err) => {
          console.error(
            `DurationAPI - Insert PageURL Messages Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });

      await Promise.all([durationMessage, pageMessages]);
    } else {
      console.warn(
        `DurationAPI - Illegal Organization Attempt. Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 403;
    }
  });
  return response;
}
