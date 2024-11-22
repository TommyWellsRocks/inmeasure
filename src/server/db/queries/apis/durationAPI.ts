import "server-only";

import { db } from "~/server/db";
import { getOrg } from "../helpers/getOrg";
import { durationMessages } from "../../schema";

import type { DurationMessage } from "~/server/types/scripts";
import { pageURLEntries } from "../../schemas/analyticsTables/pageURLEntries";

export async function authorizeAndWriteMessage(
  data: DurationMessage,
  domain: string,
  apiKey: string,
  connectionId: string,
) {
  await db.transaction(async (dbPen) => {
    // Get the organizationId where isOrganization and isConnectionId
    const organization = await getOrg(dbPen, domain, apiKey, connectionId);

    const organizationId = organization?.id;
    if (organizationId) {
      const durationMessage = dbPen
        .insert(durationMessages)
        .values({ connectionId, organizationId, timestamp: data.timestamp });
      const pageMessages = data.pageURL.map((entry) =>
        dbPen.insert(pageURLEntries).values({
          connectionId,
          organizationId,
          pageURL: entry.url,
          perfTimestamp: String(entry.perfTimestamp),
        }),
      );
      await Promise.all([durationMessage, ...pageMessages]);
    }
  });
}
