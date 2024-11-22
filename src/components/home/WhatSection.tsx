import Link from "next/link";

export function WhatSection() {
  return (
    <section className="flex flex-col items-center gap-y-10 pt-10 text-center">
      <div className="flex flex-col items-center gap-y-4">
        <span className="text-lg text-zinc-400">Simple. In-depth. Secure.</span>
        <span className="text-5xl font-semibold">Website Analytics</span>
      </div>

      <span className="text-zinc-500">
        Minimal installation with maximum results. InMeasure is the minimalist&apos;s
        dream{" "}
        <span className="text-zinc-300">
          web analytics tool for every level of scale.
        </span>
      </span>

      <Link href="#pricing">
        <button className="rounded-md bg-zinc-200 px-6 py-2 text-sm text-zinc-950 hover:bg-zinc-300">
          Get Started
        </button>
      </Link>
    </section>
  );
}
