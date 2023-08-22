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
        <Image
          src="/assets/logo_gradient.svg"
          alt="logo"
          width="35"
          height="35"
        />
        <p className="header-gradient text-[27px] font-bold pb-0.5">Threads</p>
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
