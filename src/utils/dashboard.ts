import type { DashboardConnections } from "~/server/types/InMeasure";

export function getSourceToVisitors(connections: DashboardConnections) {
  return connections.reduce<Record<string, number>>(
    (sourceToVisitors, connection) => {
      if (connection.standardMessage) {
        const source = connection.standardMessage.source || "Direct / Search";
        sourceToVisitors[source] = (sourceToVisitors[source] || 0) + 1;
      }
      return sourceToVisitors;
    },
    {},
  );
}

export function getVisitedPages(connections: DashboardConnections) {
  // page1 -> page2 -> page1 = [page1, page2]
  // Delete baseUrl and anchorID on pagesVisited
  return connections.reduce<Record<string, number>>(
    (visitedPages, connection) => {
      if (connection.pageURLMessages) {
        const uniquePagesVisited = new Set(
          connection.pageURLMessages.map(
            (entry) => new URL(entry.pageURL).pathname,
          ),
        );
        uniquePagesVisited.forEach(
          (pageUrl) =>
            (visitedPages[pageUrl] = (visitedPages[pageUrl] || 0) + 1),
        );
      }
      return visitedPages;
    },
    {},
  );
}

export function getConnectionTimestamps(connections: DashboardConnections) {
  return connections.map(
    (con) => con.durationMessages[0]?.timestamp || con.timestamp,
  );
}
