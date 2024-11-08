import {
  ChevronRight,
  ChevronsUpDown,
  Home,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { UserTab } from "./AppSiderbar/UserTab";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
];

function CompanyDropdown() {
  const companyName = "InMeasure";
  const companyPlan = "Bronze";

  return (
    <div className="flex items-center justify-between gap-x-8 rounded-lg bg-zinc-800 px-4 py-4">
      <div className="flex items-center gap-x-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{companyName}</span>
          <span className="text-xs font-light">{companyPlan}</span>
        </div>
      </div>
      <div className="rounded-lg bg-zinc-700 px-1 py-2 hover:bg-opacity-40">
        <ChevronsUpDown height={18} />
      </div>
    </div>
  );
}

function PlatformNav() {
  return (
    <section className="flex flex-col gap-y-2 px-4">
      <span className="text-xs font-light text-zinc-400">InMeasure</span>
      <div className="flex flex-col gap-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-x-2">
            <item.icon height={20} />
            <Link
              href={item.url}
              className="flex w-full items-center justify-between font-light"
            >
              {item.title}
              <ChevronRight height={18} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AppSidebar() {
  return (
    <section className="flex w-1/4 flex-col justify-between rounded-md border-r-4 border-zinc-800 bg-zinc-900 p-2">
      <div className="flex flex-col gap-y-4">
        <CompanyDropdown />
        <PlatformNav />
      </div>
      <UserTab />
    </section>
  );
}
