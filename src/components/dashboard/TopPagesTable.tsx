import { BiTable } from "./BiTable";

export function TopPagesTable({
  pageVisitors,
}: {
  pageVisitors: Record<string, number>;
}) {
  const topPages = Object.entries(pageVisitors)
    .map(([pageURL, count]) => ({
      col1: pageURL,
      col2: count,
    }))
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
