import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link href="/" className="hover:pointer text-3xl font-bold">
      InMeasure
    </Link>
  );
}
