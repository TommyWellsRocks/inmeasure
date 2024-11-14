import {
  getSourcesAndPagesCount,
  getUserOrganizations,
} from "~/server/db/queries/dashboard";

import Link from "next/link";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { TotalVisitorsTable } from "~/components/dashboard/TotalVisitorsTable";
import { SourcesTable } from "~/components/dashboard/SourcesTable";
import { TopPagesTable } from "~/components/dashboard/TopPagesTable";

export default async function Dashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return redirect(`/login?return=${encodeURIComponent("/dashboard")}`);

  const myOrganizations = await getUserOrganizations(userId);
  const organization = myOrganizations.at(0);
  const organizationId = organization?.organizationId;
  const organizationName = organization?.organizationName;
  const organizationDomain = "http://" + organization?.domain + ":3000";

  if (!organizationId) return;
  const { pageVisitors, sourcesVisitors, connectionTimestamps } =
    await getSourcesAndPagesCount(organizationId);

  return (
    <main className="flex flex-col gap-y-20 px-10">
      <section className="flex flex-col gap-y-2">
        <span className="text-xl font-semibold">{organizationName}</span>
        <Link
          href={organizationDomain}
          className="text-sm underline underline-offset-1"
        >
          {organizationDomain}
        </Link>
      </section>

      <section>
        {/* Give these totals, but also have a graph to literally show them by time with dropdown ranges */}
        <TotalVisitorsTable connectionTimestamps={connectionTimestamps} />
      </section>

      <div className="flex justify-between gap-10">
        <SourcesTable sourcesVisitors={sourcesVisitors} />

        <TopPagesTable pageVisitors={pageVisitors} />
      </div>
    </main>
  );
}
