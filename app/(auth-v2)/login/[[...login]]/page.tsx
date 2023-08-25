import GoogleButton from "@/components/auth/GoogleButton";
import LinkedInButton from "@/components/auth/LinkedInButton";
import Logo from "@/components/shared/Logo";
import { IoLogoLinkedin } from "react-icons/io5";
import { RiArrowRightLine } from "react-icons/ri";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">Sign in</h4>
          <p className="text-gray-2">to continue to Threads</p>
        </div>
        <Logo />
      </div>
      {/* Form Socials OAuth */}
      <div className="w-full flex flex-col justify-center items-start gap-2">
        {/* <button>Continue with Google</button> */}
        <GoogleButton />
        <LinkedInButton />
      </div>
    </div>
  );
};

export default Page;
