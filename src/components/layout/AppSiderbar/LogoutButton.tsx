"use client";

import { LogOut } from "lucide-react";
import { useCompany } from "~/hooks/useCompany";

export function LogoutButton() {
  const logoutCompanies = useCompany((state) => state.logoutCompanies);
  return (
    <button
      className="flex gap-x-2 hover:cursor-pointer"
      onClick={() => logoutCompanies()}
    >
      <LogOut height={18} />
      <span>Logout</span>
    </button>
  );
}
