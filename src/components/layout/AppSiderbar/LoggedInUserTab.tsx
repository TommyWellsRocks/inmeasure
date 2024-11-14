import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ChevronsUp } from "lucide-react";
import { ProfileIcon } from "../HeaderNav/ProfileIcon";
import { LogoutButtonWrapper } from "../LogoutButtonWrapper";
import { LogoutButton } from "./LogoutButton";

export function LoggedInUserTab({
  userImage,
  name,
  email,
}: {
  userImage: string | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="group flex items-center justify-between gap-x-4 rounded-lg p-2 text-start hover:bg-zinc-800">
          <div className="flex w-full items-center gap-x-2">
            <ProfileIcon userImage={userImage} />
            <div className="flex flex-col">
              {name ? (
                <span className="text-sm font-medium">
                  {name.slice(0, 18) || ""}
                </span>
              ) : null}
              {email ? (
                <span className="text-xs font-light">{email.slice(0, 25)}</span>
              ) : null}
            </div>
            <PopoverContent className="flex flex-col gap-y-2 border-none bg-zinc-950 text-sm text-zinc-50">
              <LogoutButtonWrapper>
                <LogoutButton />
              </LogoutButtonWrapper>
            </PopoverContent>
          </div>
          <div className="rounded-lg px-1 py-2 group-hover:bg-zinc-900">
            <ChevronsUp height={18} />
          </div>
        </div>
      </PopoverTrigger>
    </Popover>
  );
}
