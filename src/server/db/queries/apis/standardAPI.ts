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

      const standardMessageValues = {
        ...data,
        connectionId,
        organizationId,
        timeToPageLoad: String(data.timeToPageLoad),
        timeToFirstInteraction: String(data.timeToFirstInteraction),
        perfTimestamp: String(data.perfTimestamp),
      };
      await dbPen.insert(standardMessages).values(standardMessageValues);
    });
  } catch (err: any) {
    console.error(err.message);
    response.responseStatus = 500;
    return response;
  }

  return response;
}
