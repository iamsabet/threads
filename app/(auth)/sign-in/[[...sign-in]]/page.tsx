import { clerckComponentsOptions } from "@/constants";
import { SignIn } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Sign In to Hex-Threads`, // change My App to your app name
    description: "Sign In page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}sign-in`, // Edit to your app URL
      title: `Sign In to Hex-Threads`,
      description: "Sign In page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}

const Page = () => {
  return <SignIn appearance={clerckComponentsOptions} />;
};

export default Page;
