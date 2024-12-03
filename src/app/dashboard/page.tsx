"use client";

import { useOrganization } from "~/hooks/useOrganization";
import { useEffect, useState } from "react";

import { getDashboardData } from "~/server/actions/dashboard";

import Link from "next/link";
import { SourcesTable } from "~/components/dashboard/SourcesTable";
import { TopPagesTable } from "~/components/dashboard/TopPagesTable";
import { TimestampSection } from "~/components/dashboard/TimestampsSection/TimestampSection";
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

  useEffect(() => {
    if (org)
      getDashboardData(org.id).then((connections) => {
        setPageVisitors(getVisitedPages(connections));
        setSourceToVisitors(getSourceToVisitors(connections));
        setConnectionTimestamps(getConnectionTimestamps(connections));
      });
  }, [org, reloadFlag]);

  const orgDomain = "https://" + (org?.domain || "example.com");

  return (
    <main className="flex flex-col gap-y-10 px-4 sm:gap-y-20 sm:px-10">
      <section className="flex items-center justify-between gap-x-2">
        <div className="flex flex-col gap-y-2">
          <span className="text-xl font-semibold">
            {org?.organizationName || "DUMMY DATA"}
          </span>
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

      <TimestampSection connectionTimestamps={connectionTimestamps} />

      <section className="flex flex-col justify-between gap-10 text-sm min-[470px]:flex-row sm:text-base">
        <SourcesTable sourceToVisitors={sourceToVisitors} />

        <TopPagesTable pageVisitors={pageVisitors} />
      </section>
    </main>
  );
}
