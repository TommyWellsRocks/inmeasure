export function AboutItem({
  name,
  tagline,
  children,
}: {
  name: string;
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-around rounded-full bg-zinc-900 px-10 py-4">
      <span className="text-3xl font-semibold text-zinc-300">{name}.</span>
      <div className="flex w-1/2 flex-col items-center">
        <span className="text-lg font-medium text-zinc-500">{tagline}</span>
        <div className="flex flex-col text-center text-zinc-300">
          {children}
        </div>
      </div>
    </div>
  );
}
