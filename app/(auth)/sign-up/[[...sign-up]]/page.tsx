import { clerckComponentsOptions } from "@/constants";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return <SignUp appearance={clerckComponentsOptions} />;
};

export default Page;
