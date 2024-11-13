import Link from "next/link";
import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";

export function Help() {
  return (
    <Section id="help">
      <SectionHeader text="Still Need Help?" />
      <span>
        Sorry! Please email us:{" "}
        <Link href="mailto:help@inmeasure.com" className="underline">
          help@inmeasure.com
        </Link>
      </span>
    </Section>
  );
}
