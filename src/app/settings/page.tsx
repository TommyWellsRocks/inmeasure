import { Organization } from "~/components/settings/organization/Organization";
import { Billing } from "~/components/settings/billing/Billing";

export default function Settings() {
  return (
    <main className="mx-auto flex w-full max-w-[800px] flex-col gap-y-20 font-light">
      <Organization />
      <Billing />
    </main>
  );
}
