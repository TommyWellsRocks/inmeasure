import Link from "next/link";

import { SectionHeader } from "../SectionHeader";
import { Section } from "../Section";

export function InviteYourTeam() {
  return (
    <Section id="invite">
      <SectionHeader text="Invite Your Team" />

      <span>1. Make sure the user has an InMeasure account.</span>
      <span>
        2. Go to your{" "}
        <Link href="/settings#company" className="underline">
          company settings
        </Link>
        .
      </span>
      <span>3. Add user to seat.</span>
    </Section>
  );
}
