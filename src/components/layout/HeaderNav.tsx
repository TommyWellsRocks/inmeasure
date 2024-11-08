import { HeaderLogo } from "./HeaderNav/HeaderLogo";

export async function HeaderNav() {
  return (
    <header className="flex items-center justify-between px-10 py-8">
      <HeaderLogo />
    </header>
  );
}
