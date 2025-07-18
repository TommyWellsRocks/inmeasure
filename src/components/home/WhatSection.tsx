import Link from "next/link";

export function WhatSection() {
  return (
    <section
      className="flex flex-col items-center gap-y-10 pt-10 text-center"
      id="what"
    >
      <div className="flex flex-col items-center gap-y-4">
        <span className="text-lg text-zinc-400">Simple. In-depth. Secure.</span>
        <span className="text-5xl font-semibold lg:text-6xl xl:text-7xl">
          Website Analytics
        </span>
      </div>

      <div className="flex flex-col items-center text-zinc-500">
        <span>
          Deep insights into user behavior, performance optimization, and
          conversion tracking to help make data-driver decisions.
        </span>
        <span>
          Reason of existence:{" "}
          <span className="text-zinc-300">
            Be simple to deal with, offer useful and accurate data, and protect
            user privacy at all cost.
          </span>
        </span>
        <span>
          InMeasure is the{" "}
          <span className="text-zinc-300">
            web analytics tool for every level of scale.
          </span>
        </span>
      </div>

      <Link href="/pricing">
        <button className="rounded-md bg-zinc-200 px-6 py-2 text-sm text-zinc-950 hover:bg-zinc-300">
          Get Started
        </button>
      </Link>
    </section>
  );
}
