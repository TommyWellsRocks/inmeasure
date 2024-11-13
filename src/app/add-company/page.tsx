import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { AddCompanyForm } from "~/components/add-company/AddCompanyForm";
import Link from "next/link";

export default async function AddCompany() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return redirect(`/login?return=${encodeURIComponent("/add-company")}`);

  return (
    <main className="mx-auto flex w-full max-w-[600px] flex-col gap-y-20">
      <AddCompanyForm userId={userId} />
      <div className="flex flex-col items-center gap-y-2 rounded-md bg-zinc-800 px-4 py-2">
        <span className="text-lg font-semibold">
          Is your company already using InMeasure?
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
