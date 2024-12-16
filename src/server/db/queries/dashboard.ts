import "server-only";

import { db } from "~/server/db";

export async function getTheDashboardData(organizationId: string) {
  try {
    return {
      value: await db.query.connectionEntries.findMany({
        columns: { connectionId: true, timestamp: true },
        where: (model, { eq }) => eq(model.organizationId, organizationId),
        with: {
          standardMessage: { columns: { source: true } },
          pageURLMessages: { columns: { pageURL: true } },
          durationMessages: {
            columns: { timestamp: true },
            orderBy: (model, { desc }) => desc(model.timestamp),
            limit: 1,
          },
        },
      }),
      err: null,
    };
  } catch (err: any) {
    console.error(err.message);
    return { value: null, err: "Error getting dashboard data from DB." };
  }
}
