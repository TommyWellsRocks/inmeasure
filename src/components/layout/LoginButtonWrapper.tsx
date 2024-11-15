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
          return redirect("/?error=loginError");
        }
      }}
    >
      {children}
    </form>
  );
}
