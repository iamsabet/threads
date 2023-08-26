import GoogleButton from "@/components/auth/GoogleButton";
import LinkedInButton from "@/components/auth/LinkedInButton";
import VerofifyForm from "@/components/auth/forms/VerofifyForm";
import Logo from "@/components/shared/Logo";
import { Edit, PersonStanding } from "lucide-react";
import Link from "next/link";
import {
  IoPersonCircle,
  IoPersonCircleOutline,
  IoPersonCircleSharp,
} from "react-icons/io5";
import { RiUserFill } from "react-icons/ri";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">
            Verify your email
          </h4>
          <p className="text-gray-2">To reset your password</p>
        </div>
        <Logo size={45} />
      </div>

      <div className="email-chip">
        <IoPersonCircleSharp size={20} />
        <p className="text-subtle-medium text-gray-2">iamsabet7@gmail.com</p>
        <Link href="/forgot" className="form-link">
          <Edit size={15} />
        </Link>
      </div>

      <div className="w-full flex flex-col justify-start gap-1 items-start">
        <h4 className="text-small-medium font-semibold text-light-1">
          Verification code
        </h4>
        <p className="text-small-regular text-gray-2">
          Enter the verification code sent to your email address
        </p>
      </div>

      <VerofifyForm />
    </div>
  );
};

export default Page;
