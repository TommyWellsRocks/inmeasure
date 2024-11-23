"use client";

import { useOrganization } from "~/hooks/useOrganization";
import { useEffect, useState } from "react";

import { getDashboardData } from "~/server/actions/dashboard";

import Link from "next/link";
import { TotalVisitorsTable } from "~/components/dashboard/TotalVisitorsTable";
import { SourcesTable } from "~/components/dashboard/SourcesTable";
import { TopPagesTable } from "~/components/dashboard/TopPagesTable";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import {
  getConnectionTimestamps,
  getSourceToVisitors,
  getVisitedPages,
} from "~/utils/dashboard";

export default function Dashboard() {
  const org = useOrganization((state) => state.organization?.organization);
  const [pageVisitors, setPageVisitors] = useState<Record<string, number>>({});
  const [sourceToVisitors, setSourceToVisitors] = useState<
    Record<string, number>
  >({});
  const [reloadFlag, setReloadFlag] = useState(false);
  const [connectionTimestamps, setConnectionTimestamps] = useState<number[]>(
    [],
  );
  const router = useRouter();

  useEffect(() => {
    if (org)
      getDashboardData(org.id).then((connections) => {
        // ! This is error prone. Problems in all this function if only the connection is made, but no messages.

        setPageVisitors(getVisitedPages(connections));
        setSourceToVisitors(getSourceToVisitors(connections));
        setConnectionTimestamps(getConnectionTimestamps(connections));
      });
  }, [org, reloadFlag]);

  if (!org) return router.push("/");

  const orgDomain = "https://" + org.domain;

  return (
    <main className="flex flex-col gap-y-20 px-10">
      <section className="flex items-center justify-between gap-x-2">
        <div className="flex flex-col gap-y-2">
          <span className="text-xl font-semibold">{org.organizationName}</span>
          <Link
            href={orgDomain}
            target="_blank"
            className="text-sm underline underline-offset-1"
          >
            {orgDomain}
          </Link>
        </div>
        <button onClick={() => setReloadFlag((state) => !state)}>
          <RefreshCcw />
        </button>
      </section>

      <section>
        {/* Give these totals, but also have a graph to literally show them by time with dropdown ranges */}
        <TotalVisitorsTable connectionTimestamps={connectionTimestamps} />
      </section>

      <section className="flex justify-between gap-10">
        <SourcesTable sourceToVisitors={sourceToVisitors} />

        <TopPagesTable pageVisitors={pageVisitors} />
      </section>
    </main>
  );
}
