import "server-only";

import { db } from "~/server/db";

export async function getDashboardData(organizationId: string) {
  const allConnections = await db.query.connectionEntries.findMany({
    columns: { connectionId: true },
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
  });
  const sourcesVisitors: Record<string, number> = {};
  const pageVisitors: Record<string, number> = {};
  const connectionTimestamps: number[] = [];

  // For each connection, get the pages visited, and source
  // page1 -> page2 -> page1 = [page1, page2]
  allConnections.forEach((connection) => {
    const source = connection.standardMessage?.source || "Direct / Search";
    const pagesVisited = new Set(
      ...connection.pageURLMessages.map((entry) => entry.pageURL),
    );

    sourcesVisitors[source] = (sourcesVisitors[source] || 0) + 1;
    pagesVisited.forEach((visitedPage) => {
      if (visitedPage) {
        pageVisitors[visitedPage] = (pageVisitors[visitedPage] || 0) + 1;
      }
    });
    // Connection latest timestamp
    connectionTimestamps.push(connection.durationMessages[0]!.timestamp);
  });

  return { pageVisitors, sourcesVisitors, connectionTimestamps };
}
