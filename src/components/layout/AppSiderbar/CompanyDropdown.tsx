"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useCompany } from "~/hooks/useCompany";
import { Company } from "~/server/types/InMeasure";

function CompanyOption({
  company,
  isSelected = false,
  hoverBG = true,
  children,
}: {
  company: Company;
  isSelected?: boolean;
  hoverBG?: boolean;
  children?: React.ReactNode;
}) {
  const setCompany = useCompany.getState().setCompany;
  return (
    <div
      onClick={() => (isSelected ? null : setCompany(company.client!.id))}
      className={`flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 ${hoverBG && "hover:bg-zinc-950"}`}
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">
          {company.client?.companyName}
        </span>
        <span className="text-xs font-light">{company.client?.tier}</span>
      </div>
      {children}
    </div>
  );
}

function AddCompanyItem() {
  return (
    <Link
      href={"/add-company"}
      className="flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 hover:bg-zinc-950"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Add Company</span>
      </div>
      <div className="rounded-lg bg-zinc-800 px-1 py-2">
        <Plus height={18} />
      </div>
    </Link>
  );
}

function SelectedCompany() {
  const company = useCompany((state) => state.company);

  return (
    <CompanyOption company={company!} isSelected>
      <div className="rounded-lg px-1 py-2">
        <Check height={18} />
      </div>
    </CompanyOption>
  );
}

function DropDown() {
  const company = useCompany((state) => state.company);

  return (
    <CompanyOption company={company!} hoverBG={false} isSelected>
      <div className="rounded-lg px-1 py-2 group-hover:bg-zinc-800">
        <ChevronsUpDown height={18} />
      </div>
    </CompanyOption>
  );
}

export function CompanyDropdown() {
  const companies = useCompany((state) => state.companies);
  const company = useCompany((state) => state.company);

  return company ? (
    <Popover>
      <PopoverTrigger>
        <DropDown />

        <PopoverContent className="flex flex-col gap-y-1 border-none bg-zinc-700 p-2 text-zinc-100">
          {companies?.map((c, i) =>
            c.client?.id === company.client?.id ? (
              <SelectedCompany key={i} />
            ) : (
              <CompanyOption key={i} company={c} />
            ),
          )}
          <AddCompanyItem />
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  ) : (
    <AddCompanyItem />
  );
}
