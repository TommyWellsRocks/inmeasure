import {
  getSourcesAndPagesCount,
  getUserClients,
} from "~/server/db/queries/dashboard";

import Link from "next/link";
import { BiTable } from "~/components/dashboard/BiTable";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return redirect(`/signin?return=${encodeURIComponent("/dashboard")}`);

  const myCompanies = await getUserClients(userId);
  const client = myCompanies.at(0)?.client;
  const clientId = client?.id;
  const clientName = client?.companyName;
  const clientDomain = "http://" + client?.domain + ":3000";

  if (!clientId) return;
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
        <Link
          href={clientDomain}
          className="text-sm underline underline-offset-1"
        >
          {clientDomain}
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
