import Link from "next/link";
import { Section } from "../Section";

export function Introduction() {
  return (
    <Section id="introduction">
      <span className="text-3xl font-semibold">Welcome To InMeasure.</span>
      <span>
        Let's get you off our site, and back to yours. And if we miss what
        you're looking for check our{" "}
        <Link className="underline" href="#help">
          help section
        </Link>
        .
      </span>
    </Section>
  );
}
