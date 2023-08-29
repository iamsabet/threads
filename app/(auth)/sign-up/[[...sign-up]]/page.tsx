import { clerckComponentsOptions } from "@/constants";
import { SignUp } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Sign Up in Hex-Threads`, // change My App to your app name
    description: "Sign Up page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}sign-up`, // Edit to your app URL
      title: `Sign Up in Hex-Threads`,
      description: "Sign Up page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}

const Page = () => {
  return <SignUp appearance={clerckComponentsOptions} />;
};

export default Page;
