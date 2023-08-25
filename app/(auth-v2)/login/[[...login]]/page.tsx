import GoogleButton from "@/components/auth/GoogleButton";
import LinkedInButton from "@/components/auth/LinkedInButton";
import SignInForm from "@/components/auth/forms/SignInForm";
import Logo from "@/components/shared/Logo";

const Page = () => {
  return (
    <div className="form-card-container">
      {/* Form Header */}
      <div className="w-full flex justify-between gap-2">
        <div className="flex flex-col items-start justify-start">
          <h4 className="text-[22px] font-semibold text-light-1">Sign in</h4>
          <p className="text-gray-2">to continue to Threads</p>
        </div>
        <Logo size={45} />
      </div>
      {/* Form Socials OAuth */}
      <div className="w-full flex flex-col justify-center items-start gap-2">
        {/* <button>Continue with Google</button> */}
        <GoogleButton />
        <LinkedInButton />
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

      <SignInForm />
    </div>
  );
};

export default Page;
