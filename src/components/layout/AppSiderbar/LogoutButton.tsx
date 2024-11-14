"use client";

import { LogOut } from "lucide-react";
import { useOrganization } from "~/hooks/useOrganization";

export function LogoutButton() {
  const logoutOrganizations = useOrganization(
    (state) => state.logoutOrganizations,
  );
  return (
    <button
      className="flex gap-x-2 hover:cursor-pointer"
      onClick={() => logoutOrganizations()}
    >
      <LogOut height={18} />
      <span>Logout</span>
    </button>
  );
}
