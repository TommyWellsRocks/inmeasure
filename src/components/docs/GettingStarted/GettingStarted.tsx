import Link from "next/link";

import { SectionHeader } from "../../SectionHeader";
import { CopyScript } from "./CopyScript";
import { Section } from "~/components/Section";

export function GettingStarted() {
  return (
    <Section id="getting-started">
      <SectionHeader text="Getting Started" />

      <CopyScript />

      <span>
        That's it. All setup. Go to your{" "}
        <Link href="/dashboard" className="underline">
          dashboard
        </Link>
        , to see your visitor data.
      </span>
    </Section>
  );
}
