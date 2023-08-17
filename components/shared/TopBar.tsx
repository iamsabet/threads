import Link from "next/link";
import Image from "next/image";
import LogoutComponent from "./LogoutComponent";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
const TopBar = async () => {
  const user = await currentUser();
  let userInfo;
  if (user) userInfo = await fetchUser(user.id);

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
      </div>
    </nav>
  );
};

export default TopBar;
