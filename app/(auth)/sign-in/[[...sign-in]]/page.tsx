import { clerckComponentsOptions } from "@/constants";
import { SignIn } from "@clerk/nextjs";
import React from "react";
const Page = () => {
  return <SignIn appearance={clerckComponentsOptions} />;
};

export default Page;
