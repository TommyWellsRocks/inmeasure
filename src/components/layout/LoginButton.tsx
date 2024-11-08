import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "~/server/auth";

export function LoginButton({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </form>
  );
}
