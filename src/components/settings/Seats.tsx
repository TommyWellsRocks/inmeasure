"use client";

import { useCompany } from "~/hooks/useCompany";
import { useSession } from "~/hooks/useSession";

import { SettingsItem } from "./SettingsItem";
import { Trash2 } from "lucide-react";
import { AddSeatUserButton } from "./AddSeatUserButton";

export function Seats({ tierMaxSeats }: { tierMaxSeats: number }) {
  const session = useSession((state) => state.session);
  const company = useCompany((state) => state.company);
  const userId = session?.user?.id;
  const users = company?.client?.users;
  const userCount = users?.length!;
  const hasSeatsAvailable = userCount < tierMaxSeats;
  return (
    <div className="flex flex-col items-start gap-y-2">
      <SettingsItem
        name="Seats"
        value={`${userCount || 0} / ${tierMaxSeats}`}
      />

      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-5 rounded-md bg-zinc-800 p-2 text-sm">
          <div className="flex flex-col gap-y-2">
            <span className="text-base font-medium">Name</span>
            {users?.map((user, i) => <span key={i}>{user?.user?.name}</span>)}
          </div>

          <div className="flex flex-col gap-y-2">
            <span className="text-base font-medium">Email</span>
            {users?.map((user, i) => <span>{user?.user?.email}</span>)}
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="h-6" />
            {users?.map((user) =>
              user.userId !== userId ? (
                <button className="h-5" onClick={() => {}}>
                  <Trash2 height={15} />
                </button>
              ) : (
                <div className="h-5" />
              ),
            )}
          </div>
        </div>

        {hasSeatsAvailable && <AddSeatUserButton />}
      </div>
    </div>
  );
}
