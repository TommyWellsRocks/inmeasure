import Link from "next/link";
import { auth } from "~/server/auth";

export async function HeaderNav() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <header className="flex items-center justify-between px-10 py-8">
      <Link href="/" className="text-3xl font-bold">
        InMeasure
      </Link>

      {userId ? (
        <Link href="/dashboard">
          <button className="rounded-lg bg-zinc-700 px-6 py-2">
            Get Started
          </button>
        </Link>
      ) : (
        <Link href="/login">
          <button className="rounded-lg bg-zinc-700 px-4 py-2">Login</button>
        </Link>
      )}
    </header>
  );
}
