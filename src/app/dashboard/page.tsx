"use client";

import { useOrganization } from "~/hooks/useOrganization";
import { useEffect, useState } from "react";

import { getSourcesAndPagesCount } from "~/server/actions/dashboard";

import Link from "next/link";
import { TotalVisitorsTable } from "~/components/dashboard/TotalVisitorsTable";
import { SourcesTable } from "~/components/dashboard/SourcesTable";
import { TopPagesTable } from "~/components/dashboard/TopPagesTable";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const org = useOrganization((state) => state.organization?.organization);
  const [pageVisitors, setPageVisitors] = useState<Record<string, number>>({});
  const [sourcesVisitors, setSourcesVisitors] = useState<
    Record<string, number>
  >({});
  const [connectionTimestamps, setConnectionTimestamps] = useState<number[]>(
    [],
  );
  const router = useRouter();

  useEffect(() => {
    if (org)
      getSourcesAndPagesCount(org.id).then((res) => {
        setPageVisitors(res.pageVisitors);
        setSourcesVisitors(res.sourcesVisitors);
        setConnectionTimestamps(res.connectionTimestamps);
      });
  }, [org]);

  if (!org) return router.push("/");

  const orgDomain = "https://" + org.domain;

  // if (!userId)
  //   return redirect(`/login?return=${encodeURIComponent("/dashboard")}`);

  return (
    <main className="flex flex-col gap-y-20 px-10">
      <section className="flex flex-col gap-y-2">
        <span className="text-xl font-semibold">{org.organizationName}</span>
        <Link
          href={orgDomain}
          target="_blank"
          className="text-sm underline underline-offset-1"
        >
          {orgDomain}
        </Link>
      </section>

      <section>
        {/* Give these totals, but also have a graph to literally show them by time with dropdown ranges */}
        <TotalVisitorsTable connectionTimestamps={connectionTimestamps} />
      </section>

      <section className="flex justify-between gap-10">
        <SourcesTable sourcesVisitors={sourcesVisitors} />

        <TopPagesTable pageVisitors={pageVisitors} />
      </section>
    </main>
  );
}
