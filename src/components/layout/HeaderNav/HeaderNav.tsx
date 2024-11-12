import { HeaderLogo } from "./HeaderLogo";

export async function HeaderNav() {
  return (
    <header className="flex px-10 py-8">
      <HeaderLogo />
    </header>
  );
}
