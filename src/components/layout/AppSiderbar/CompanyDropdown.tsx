"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export interface Company {
  id: string;
  name: string;
  plan: string;
}

function CompanyOption({
  company,
  hoverBG = true,
  children,
  setter,
}: {
  company: Company;
  hoverBG?: boolean;
  children?: React.ReactNode;
  setter?: React.Dispatch<React.SetStateAction<Company | null>>;
}) {
  return (
    <div
      onClick={() => (setter ? setter(company) : null)}
      className={`flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 ${hoverBG && "hover:bg-zinc-950"}`}
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">{company.name}</span>
        <span className="text-xs font-light">{company.plan}</span>
      </div>
      {children}
    </div>
  );
}

function CreateCompanyItem() {
  return (
    <Link
      href={"/create-client"}
      className="flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 hover:bg-zinc-950"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Create Company</span>
      </div>
      <div className="rounded-lg bg-zinc-800 px-1 py-2">
        <Plus height={18} />
      </div>
    </Link>
  );
}

function SelectedCompany({ item }: { item: Company }) {
  return (
    <CompanyOption company={item}>
      <div className="rounded-lg px-1 py-2">
        <Check height={18} />
      </div>
    </CompanyOption>
  );
}

function DropDown({ company }: { company: Company }) {
  return (
    <CompanyOption company={company} hoverBG={false}>
      <div className="rounded-lg px-1 py-2 group-hover:bg-zinc-800">
        <ChevronsUpDown height={18} />
      </div>
    </CompanyOption>
  );
}

export function CompanyDropdown({ companies }: { companies: Company[] }) {
  const defaultCompany = companies.length > 0 ? companies.at(0)! : null;
  const [company, setCompany] = useState<Company | null>(defaultCompany);

  return company ? (
    <Popover>
      <PopoverTrigger>
        <DropDown company={company} />

        <PopoverContent className="flex flex-col gap-y-1 border-none bg-zinc-700 p-2 text-zinc-100">
          {companies.map((item) =>
            item.id === company.id ? (
              <SelectedCompany item={item} />
            ) : (
              <CompanyOption company={item} setter={setCompany} />
            ),
          )}
          <CreateCompanyItem />
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  ) : (
    <CreateCompanyItem />
  );
}
