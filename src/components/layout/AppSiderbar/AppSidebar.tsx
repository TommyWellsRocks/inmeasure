import { ArrowLeft, BookText, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { CompanyDropdown } from "./CompanyDropdown";
import { UserTab } from "./UserTab";
import type { Session } from "next-auth";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    subsections: [
      { title: "Installation", url: "#installation" },
      { title: "Features", url: "#features" },
      { title: "Pricing", url: "#pricing" },
    ],
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    subsections: [
      { title: "Overview", url: "#overview" },
      { title: "Load Performance", url: "#load-performance" }, // Greyed Out
      { title: "Session Recordings", url: "#session-recordings" }, // Greyed Out
    ],
  },
  {
    title: "Documentation",
    url: "/docs",
    icon: BookText,
    subsections: [
      { title: "Introduction", url: "#introduction" },
      { title: "Getting Started", url: "#getting-started" },
      { title: "Invite Your Team", url: "#invite" },
      { title: "Need Help", url: "#help" },
    ],
  },
];

function PlatformNav() {
  return (
    <section className="flex flex-col gap-y-2 px-2">
      <span className="text-xs font-light text-zinc-400">InMeasure</span>
      <div className="flex flex-col gap-y-6">
        {items.map((item, index) => (
          <nav className="flex flex-col gap-y-1">
            <div
              key={index}
              className="flex items-center gap-x-2 font-semibold"
            >
              <item.icon height={20} />
              <Link href={item.url} className="flex w-full items-center">
                {item.title}
              </Link>
            </div>
            <div className="ml-10 flex flex-col gap-y-1 font-extralight">
              {item.subsections?.map((sub) => (
                <Link className="hover:font-medium" href={item.url + sub.url}>
                  {sub.title}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>
    </section>
  );
}

export function AppSidebar({ session }: { session: Session | null }) {
  return (
    <section className="flex flex-row-reverse gap-x-2">
      <input type="checkbox" id="toggle" className="peer hidden bg-white" />
      <label
        htmlFor="toggle"
        className="my-auto flex flex-col peer-checked:rotate-180"
      >
        <ArrowLeft />
      </label>

      <div
        className={`flex min-w-[250px] flex-col justify-between rounded-md border-r-4 border-zinc-800 bg-zinc-900 p-2 peer-checked:hidden`}
      >
        <div className="flex flex-col gap-y-4">
          <CompanyDropdown />
          <PlatformNav />
        </div>
        <UserTab session={session} />
      </div>
    </section>
  );
}
