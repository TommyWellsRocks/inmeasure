import { LoggedInUserTab } from "./LoggedInUserTab";
import { LoggedOutUserTab } from "./LoggedOutUserTab";
import type { Session } from "next-auth";

export async function UserTab({ session }: { session: Session | null }) {
  const user = session?.user;
  return user ? (
    <LoggedInUserTab
      userImage={user?.image}
      name={user?.name}
      email={user?.email}
    />
  ) : (
    <LoggedOutUserTab userImage={null} />
  );
}
