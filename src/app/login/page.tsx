import { redirect } from "next/navigation";
import { signIn, auth } from "~/server/auth";
import AuthError from "next-auth";

export const dynamic = "force-dynamic";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { return: string };
}) {
  const session = await auth();
  const returnURL = searchParams.return || "/";
  if (session?.user?.id) return redirect(returnURL);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="text-3xl font-semibold">Sign In / Sign Up</div>
      <form
        action={async () => {
          "use server";
          try {
            await signIn("google");
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`/?error=${error}`);
            }
            throw error;
          }
        }}
      >
        <button
          className="flex gap-2 rounded-md border border-zinc-500 px-4 py-2 text-base"
          type="submit"
        >
          <img
            loading="lazy"
            alt="Google Logo"
            src="/auth/google-icon.svg"
            height={22}
            width={22}
          />
          <span>Continue with Google</span>
        </button>
      </form>
    </main>
  );
}
