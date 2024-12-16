import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { AddOrganizationForm } from "~/components/add-organization/AddOrganizationForm";
import Link from "next/link";

export default async function AddOrganization() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return redirect(`/login?return=${encodeURIComponent("/add-organization")}`);

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col gap-y-20">
      <AddOrganizationForm  />
      <div className="flex flex-col items-center gap-y-2 rounded-md bg-zinc-800 px-4 py-2">
        <span className="text-lg font-semibold">
          Is your organization already using InMeasure?
        </span>
        <span className="text-sm font-light">
          Tell your admin to send a you a{" "}
          <Link className="underline" href={"/docs#invite"}>
            join request
          </Link>
          .
        </span>
      </div>
    </main>
  );
}
