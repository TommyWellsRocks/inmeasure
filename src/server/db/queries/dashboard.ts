import "server-only";

import { db } from "~/server/db";

export async function getSourcesAndPagesCount(clientId: string) {
  const allConnections = await db.query.browserEntries.findMany({
    columns: { source: true, pageURL: true },
    where: (model, { eq }) => eq(model.clientId, clientId),
    with: {
      heartbeatEntries: { columns: { pageURL: true } },
    },
  });
  const sourcesVisitors: Record<string, number> = {};
  const pageVisitors: Record<string, number> = {};

  // For each connection, get the pages visited, and source
  // page1 -> page2 -> page1 = [page1, page2]
  allConnections.forEach((connection) => {
    const source = connection.source || "Direct / Search";
    const pagesVisited = new Set([
      connection.pageURL,
      ...connection.heartbeatEntries.map((entry) => entry.pageURL),
    ]);

    sourcesVisitors[source] = (sourcesVisitors[source] || 0) + 1;
    pagesVisited.forEach((url) => {
      if (url) {
        pageVisitors[url] = (pageVisitors[url] || 0) + 1;
      }
    });
  });

  return { pageVisitors, sourcesVisitors };
}
