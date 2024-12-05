"use client";

import { useOrganization } from "~/hooks/useOrganization";
import { useSession } from "~/hooks/useSession";

import { SettingsItem } from "../SettingsItem";
import { Trash2 } from "lucide-react";
import { AddSeatUserButton } from "./AddSeatUserButton";

export function Seats({ maxSeats }: { maxSeats: number }) {
  const session = useSession((state) => state.session);
  const organization = useOrganization((state) => state.organization);
  const removeOrganizationUser = useOrganization(
    (state) => state.removeOrganizationUser,
  );

  const userId = session?.user?.id;
  const users = organization?.organization?.users;
  const userCount = users?.length || 0;
  const hasSeatsAvailable = userCount < maxSeats;
  return (
    <div className="flex flex-col items-start gap-y-2">
      <SettingsItem name="Seats" value={`${userCount} / ${maxSeats}`} />

      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-5 rounded-md bg-zinc-800 p-2 text-sm">
          <div className="flex flex-col gap-y-2">
            <span className="text-base font-medium">Name</span>
            {users?.map((user, i) => <span key={i}>{user.user?.name}</span>)}
          </div>

          <div className="flex flex-col gap-y-2">
            <span className="text-base font-medium">Email</span>
            {users?.map((user, i) => <span key={i}>{user.user?.email}</span>)}
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="h-6" />
            {users?.map((user, i) =>
              user.userId !== userId ? (
                <button
                  key={i}
                  className="h-5"
                  onClick={() => {
                    removeOrganizationUser(user.userId!);
                  }}
                >
                  <Trash2 height={15} />
                </button>
              ) : (
                <div key={i} className="h-5" />
              ),
            )}
          </div>
        </div>

        {hasSeatsAvailable && <AddSeatUserButton />}
      </div>
    </div>
  );
}
