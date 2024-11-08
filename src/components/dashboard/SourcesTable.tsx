import { BiTable } from "./BiTable";

export function SourcesTable({
  sourcesVisitors,
}: {
  sourcesVisitors: Record<string, number>;
}) {
  const topSources = Object.entries(sourcesVisitors)
    .map(([source, count]) => ({
      col1: source,
      col2: count,
    }))
    .sort((a, b) => b.col2 - a.col2);

  return (
    <BiTable
      tableName="Top Sources"
      col1Title="Source"
      col2Title="Visitors"
      items={topSources}
    />
  );
}
