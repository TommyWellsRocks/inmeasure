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

  try {
    await db.transaction(async (dbPen) => {
      const { value: organization, err } = await getOrg(
        dbPen,
        domain,
        apiKey,
        connectionId,
      );
      if (err || !organization?.id)
        throw new Error(err ? err : "No organizationId error.");
      const organizationId = organization.id;

      const durationMessage = dbPen
        .insert(durationMessages)
        .values({
          connectionId,
          organizationId,
          startTimestamp: data.timestamp,
        })
        .onConflictDoUpdate({
          target: durationMessages.connectionId,
          set: { endTimestamp: data.timestamp },
        });

      const pageMessageValues = data.pageURL
        .filter((entry) => entry.url)
        .map((entry) => ({
          connectionId,
          organizationId,
          pageURL: entry.url,
          perfTimestamp: String(entry.perfTimestamp),
        }));

      if (pageMessageValues.length >= 1) {
        const pageMessages = dbPen
          .insert(pageURLEntries)
          .values(pageMessageValues);
        await Promise.all([durationMessage, pageMessages]);
      } else {
        await Promise.all([durationMessage]);
      }
    });
  } catch (err: any) {
    console.error(err.message);
    response.responseStatus = 500;
    return response;
  }

  return response;
}
