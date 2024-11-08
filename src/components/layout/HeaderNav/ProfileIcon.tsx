function ProfileImage({ userImage }: { userImage: string }) {
  return (
    <img
      alt="Profile image"
      src={userImage}
      loading="eager"
      height={48}
      width={48}
      className="rounded-full"
    />
  );
}

export function ProfileIcon({
  userImage,
}: {
  userImage: string | null | undefined;
}) {
  return (
    <div className="h-10 w-10 rounded-full border bg-zinc-700">
      {userImage ? <ProfileImage userImage={userImage} /> : null}
    </div>
  );
}
