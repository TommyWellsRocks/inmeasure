"use client";

import Link from "next/link";
import { useOrganization } from "~/hooks/useOrganization";

export function CompanyInfo() {
  const org = useOrganization((state) => state.organization);
  const orgName = org?.organization?.organizationName;
  const orgDomain = "http://" + org?.organization?.domain + ":3000";

  return (
    <section className="flex flex-col gap-y-2">
      <span className="text-xl font-semibold">{orgName}</span>
      <Link href={orgDomain} className="text-sm underline underline-offset-1">
        {orgDomain}
      </Link>
    </section>
  );
}
