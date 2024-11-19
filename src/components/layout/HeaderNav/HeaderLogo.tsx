import Image from "next/image";
import Link from "next/link";

export function HeaderLogo() {
  return (
    <Link href="/" className="hover:pointer text-3xl font-bold">
      <Image
        priority
        alt="InMeasure Logo"
        src="/InMeasureLogo.png"
        width={200}
        height={23}
      />
    </Link>
  );
}
