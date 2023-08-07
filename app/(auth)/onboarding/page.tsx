import { ClerkLoading, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";
import Spinner from "../Spinner";

const Page = async () => {
  return (
    <main>
      <Suspense
        fallback={
          <ClerkLoading>
            <Spinner />
          </ClerkLoading>
        }
      >
        <UserButton afterSignOutUrl="/sign-in" />
      </Suspense>
      <h1 className="head-text"> Onboarding</h1>
    </main>
  );
};
export default Page;
