import Link from "next/link";

export function HeaderNav() {
  return (
    <header className="flex items-center justify-between px-10 py-8">
      <Link href="/" className="text-3xl font-bold">
        InMeasure
      </Link>

      <Link href="/dashboard">
        <button className="rounded-lg bg-zinc-700 px-6 py-2">
          Get Started
        </button>
      </Link>
    </header>
  );
}
