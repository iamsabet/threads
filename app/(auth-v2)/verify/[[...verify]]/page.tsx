import GoogleButton from "@/components/auth/GoogleButton";
import LinkedInButton from "@/components/auth/LinkedInButton";
import VerofifyForm from "@/components/auth/forms/VerofifyForm";
import Logo from "@/components/shared/Logo";

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

      <div className="w-full flex flex-row justify-start gap-4 items-center">
        <div
          className="flex flex-1 h-[0.5px]"
          style={{ background: "rgba(255, 255, 255, 0.15)" }}
        />
        <span className="text-gray-2 font-semibold text-small-medium">or</span>
        <div
          className="flex flex-1 h-[0.5px]"
          style={{ background: "rgba(255, 255, 255, 0.15)" }}
        />
      </div>

      <VerofifyForm />
    </div>
  );
};

export default Page;
