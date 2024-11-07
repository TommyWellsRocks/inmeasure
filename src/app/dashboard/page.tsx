import { getSourcesAndPagesCount } from "~/server/db/queries/dashboard";

import Link from "next/link";
import { BiTable } from "~/components/dashboard/BiTable";

const clientId = "920a1900-c001-4a3d-b830-eac6d9d683b2";
const clientName = "localhost";
const site = "http://localhost:3000";

export default async function Dashboard() {
  const { pageVisitors, sourcesVisitors } =
    await getSourcesAndPagesCount(clientId);

  const topSources = Object.entries(sourcesVisitors)
    .map(([source, count]) => ({
      col1: source,
      col2: count,
    }))
    .sort((a, b) => b.col2 - a.col2);
  const topPages = Object.entries(pageVisitors)
    .map(([pageURL, count]) => ({
      col1: pageURL,
      col2: count,
    }))
    .sort((a, b) => b.col2 - a.col2);

  return (
    <main className="flex flex-col gap-y-20 px-10">
      <section className="flex flex-col gap-y-2">
        <span className="text-xl font-semibold">{clientName}</span>
        <Link href={site} className="text-sm underline underline-offset-1">
          {site}
        </Link>
      </section>

      <div className="flex justify-between gap-10">
        <BiTable
          tableName="Top Sources"
          col1Title="Source"
          col2Title="Visitors"
          items={topSources}
        />

        <BiTable
          tableName="Top Pages"
          col1Title="Page"
          col2Title="Visitors"
          items={topPages}
        />
      </div>
    </main>
  );
}
