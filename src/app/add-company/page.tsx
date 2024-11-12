import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

import { AddCompanyForm } from "~/components/add-company/AddCompanyForm";

export default async function AddCompany() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId)
    return redirect(`/login?return=${encodeURIComponent("/add-company")}`);

  return (
    <main>
      <AddCompanyForm userId={userId} />
    </main>
  );
}
