import { GettingStarted } from "~/components/docs/GettingStarted/GettingStarted";
import { Help } from "~/components/docs/Help";
import { Introduction } from "~/components/docs/Introduction";
import { InviteYourTeam } from "~/components/docs/Invite";

export default function Docs() {
  return (
    <main className="mx-auto flex max-w-[800px] flex-col gap-y-20 font-light w-full">
      <Introduction />

      <GettingStarted />

      <InviteYourTeam />

      <Help />
    </main>
  );
}
