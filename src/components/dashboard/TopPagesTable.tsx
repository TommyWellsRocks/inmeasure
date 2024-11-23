import { BiTable } from "./BiTable";

export function TopPagesTable({
  pageVisitors,
}: {
  pageVisitors: Record<string, number>;
}) {
  const topPages = Object.entries(pageVisitors)
    .map(([pageURL, count]) => {
    // Delete baseUrl and anchorID on pagesVisited
      const url = new URL(pageURL).pathname;
      return {
        col1: url,
        col2: count,
      };
    })
    .sort((a, b) => b.col2 - a.col2);

  return (
    <BiTable
      tableName="Top Pages"
      col1Title="Page"
      col2Title="Visitors"
      items={topPages}
    />
  );
}
