import { ProfileIcon } from "../HeaderNav/ProfileIcon";
import { LoginButtonWrapper } from "../LoginButtonWrapper";

export function LoggedOutUserTab({
  userImage,
}: {
  userImage: string | null | undefined;
}) {
  return (
    <div className="group flex items-center justify-between gap-x-4 rounded-lg p-2 hover:bg-zinc-800">
      <div className="flex w-full items-center justify-between gap-x-2">
        <ProfileIcon userImage={userImage} />
        <LoginButtonWrapper>
          <button className="rounded-sm bg-zinc-950 px-4 py-2 text-sm">
            Log In
          </button>
        </LoginButtonWrapper>
      </div>
    </div>
  );
}
