import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher } from "@clerk/nextjs/app-beta/client";
import LogoutComponent from "./LogoutComponent";
import { dark } from "@clerk/themes";
const TopBar = () => {
  const isLoggedIn = true;

  return (
    <nav className="topbar">
      <Link href="/" className="flex flex-row items-center gap-4">
        <Image src="/assets/logo.png" alt="logo" width="32" height="32" />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex flex-row items-center gap-1">
        <div className="block md:hidden">
          <LogoutComponent />
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px2 ",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default TopBar;
