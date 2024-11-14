import { Organization } from "~/components/settings/Organization";

export default function Settings() {
  return (
    <main className="mx-auto flex w-full max-w-[800px] flex-col gap-y-20 font-light">
      <Organization />
    </main>
  );
}
