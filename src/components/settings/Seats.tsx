"use client";

import { useCompany } from "~/hooks/useCompany";

import { SettingsItem } from "./SettingsItem";
import { AddSeatUserButton } from "./AddSeatUserButton";

export function Seats({ tierMaxSeats }: { tierMaxSeats: number }) {
  const company = useCompany((state) => state.company);
  const users = company?.client?.users;
  const userCount = users?.length!;
  const hasSeatsAvailable = userCount < tierMaxSeats;
  return (
    <div className="flex flex-col items-start gap-y-2">
      <SettingsItem name="Seats" value={`${userCount} / ${tierMaxSeats}`} />

      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-2 items-center rounded-md bg-zinc-800 p-2 text-sm">
          <div className="mx-2 flex flex-col gap-y-2">
            <span className="-mx-2 text-base font-medium">Name</span>
            {users?.map((user, i) => <span key={i}>{user?.user?.name}</span>)}
          </div>
          <div className="mx-2 flex flex-col gap-y-2">
            <span className="-mx-2 text-base font-medium">Email</span>
            {users?.map((user, i) => <span key={i}>{user?.user?.email}</span>)}
          </div>
        </div>

        {hasSeatsAvailable && <AddSeatUserButton />}
      </div>
    </div>
  );
}
