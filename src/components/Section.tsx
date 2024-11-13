export function Section({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col gap-y-2 mx-4">
      {children}
    </section>
  );
}
