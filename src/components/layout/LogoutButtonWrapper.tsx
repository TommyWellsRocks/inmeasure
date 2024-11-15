import { redirect } from "next/navigation";
import { signOut } from "~/server/auth";

export function LogoutButtonWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <form
      action={async () => {
        "use server";
        try {
          await signOut();
        } catch (error) {
          console.log(error);
          return redirect("/?error=logoutError");
        }
      }}
    >
      {children}
    </form>
  );
}
