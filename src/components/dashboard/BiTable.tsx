export function BiTable({
  tableName,
  col1Title,
  col2Title,
  items,
}: {
  tableName: string;
  col1Title: string;
  col2Title: string;
  items: { col1: string; col2: number }[];
}) {
  return (
    <section className="flex w-full flex-col gap-y-2">
      <span className="text-xl font-medium">{tableName}</span>

      <div className="flex justify-between">
        <span>{col1Title}</span>
        <span>{col2Title}</span>
      </div>

      <div className="flex flex-col gap-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between rounded-lg bg-zinc-800 px-3 py-0.5"
          >
            <span>{item.col1}</span>
            <span>{item.col2}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
