"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useOrganization } from "~/hooks/useOrganization";
import { Organization } from "~/server/types/InMeasure";

function OrganizationOption({
  organization,
  isSelected = false,
  hoverBG = true,
  children,
}: {
  organization: Organization;
  isSelected?: boolean;
  hoverBG?: boolean;
  children?: React.ReactNode;
}) {
  const setOrganization = useOrganization.getState().setOrganization;
  return (
    <div
      onClick={() =>
        isSelected ? null : setOrganization(organization.organization!.id)
      }
      className={`flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 ${hoverBG && "hover:bg-zinc-950"}`}
    >
      <span className="flex items-start text-sm font-medium">
        {organization.organization?.organizationName}
      </span>
      {children}
    </div>
  );
}

function AddOrganizationItem() {
  return (
    <Link
      href={"/add-organization"}
      className="flex w-full items-center justify-between rounded-lg bg-zinc-800 p-2 hover:bg-zinc-950"
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">Add Organization</span>
      </div>
      <div className="rounded-lg bg-zinc-800 px-1 py-2">
        <Plus height={18} />
      </div>
    </Link>
  );
}

function SelectedOrganization() {
  const organization = useOrganization((state) => state.organization);

  return (
    <OrganizationOption organization={organization!} isSelected>
      <div className="rounded-lg px-1 py-2">
        <Check height={18} />
      </div>
    </OrganizationOption>
  );
}

function DropDown() {
  const organization = useOrganization((state) => state.organization);

  return (
    <OrganizationOption organization={organization!} hoverBG={false} isSelected>
      <div className="rounded-lg px-1 py-2 group-hover:bg-zinc-800">
        <ChevronsUpDown height={18} />
      </div>
    </OrganizationOption>
  );
}

export function OrganizationDropdown() {
  const organizations = useOrganization((state) => state.organizations);
  const organization = useOrganization((state) => state.organization);

  return organization ? (
    <Popover>
      <PopoverTrigger>
        <DropDown />

        <PopoverContent className="flex flex-col gap-y-1 border-none bg-zinc-700 p-2 text-zinc-100">
          {organizations?.map((c, i) =>
            c.organization?.id === organization.organization?.id ? (
              <SelectedOrganization key={i} />
            ) : (
              <OrganizationOption key={i} organization={c} />
            ),
          )}
          <AddOrganizationItem />
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  ) : (
    <AddOrganizationItem />
  );
}
