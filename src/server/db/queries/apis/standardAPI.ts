import "server-only";

import { db } from "~/server/db";
import { getOrg } from "../helpers/getOrg";
import { standardMessages } from "../../schema";

import type { StandardMessage } from "~/server/types/scripts";

export async function authorizeAndWriteMessage(
  data: StandardMessage,
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
        `StandardAPI - getOrg Authorization Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 500;
    });

    const organizationId = organization?.id;
    if (organizationId) {
      await dbPen
        .insert(standardMessages)
        .values({
          ...data,
          connectionId,
          organizationId,
          timeToPageLoad: String(data.timeToPageLoad),
          timeToFirstInteraction: String(data.timeToFirstInteraction),
          perfTimestamp: String(data.perfTimestamp),
        })
        .catch((err) => {
          console.error(
            `StandardAPI - Insert Standard Message Error: ${err} - Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
          );
          response.responseStatus = 500;
        });
    } else {
      console.warn(
        `StandardAPI - Illegal Organization Attempt. Domain: ${domain}, APIKEY: ${apiKey}, ConnectionId: ${connectionId}.`,
      );
      response.responseStatus = 403;
    }
  });
  return response;
}
