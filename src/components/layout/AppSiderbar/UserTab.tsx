import { auth } from "~/server/auth";

import { LoggedInUserTab } from "./LoggedInUserTab";
import { LoggedOutUserTab } from "./LoggedOutUserTab";

export async function UserTab() {
  const session = await auth();
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
