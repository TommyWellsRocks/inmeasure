import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "~/server/auth";

export function LoginButtonWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signIn("google");
        } catch (error) {
          console.log(error);
          // Signin can fail for a number of reasons, such as the user
          // not existing, or the user not having the correct role.
          // In some cases, you may want to redirect to a custom error
          if (error instanceof AuthError) {
            return redirect(`/?error=${error.type}`);
          }

          // Otherwise if a redirects happens NextJS can handle it
          // so you can just re-thrown the error and let NextJS handle it.
          // Docs:
          // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
          throw error;
        }
      }}
    >
      {children}
    </form>
  );
}
