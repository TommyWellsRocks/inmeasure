import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signOut } from "~/server/auth";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signOut();
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
