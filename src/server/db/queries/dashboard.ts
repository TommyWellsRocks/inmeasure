import "server-only";

import { db } from "~/server/db";


export async function getDashboardData(organizationId: string) {
  const allConnections = await db.query.connectionEntries.findMany({
    columns: { connectionId: true, realTimestamp: true },
    where: (model, { eq }) => eq(model.organizationId, organizationId),
    with: {
      browserEntry: { columns: { source: true, pageURL: true } },
      heartbeatEntries: { columns: { pageURL: true } },
    },
  });
  const sourcesVisitors: Record<string, number> = {};
  const pageVisitors: Record<string, number> = {};
  const connectionTimestamps: number[] = [];

  // For each connection, get the pages visited, and source
  // page1 -> page2 -> page1 = [page1, page2]
  allConnections.forEach((connection) => {
    const source = connection.browserEntry?.source || "Direct / Search";
    const pagesVisited = new Set([
      connection.browserEntry?.pageURL,
      ...connection.heartbeatEntries.map((entry) => entry.pageURL),
    ]);

    sourcesVisitors[source] = (sourcesVisitors[source] || 0) + 1;
    pagesVisited.forEach((url) => {
      if (url) {
        pageVisitors[url] = (pageVisitors[url] || 0) + 1;
      }
    });
    connectionTimestamps.push(connection.realTimestamp);
  });

  return { pageVisitors, sourcesVisitors, connectionTimestamps };
}
