"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SearchResults from "@/components/search/SearchResults";
import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Search users in Hex-Threads`, // change My App to your app name
    description: "Search page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}search`, // Edit to your app URL
      title: `Search users in Hex-Threads`,
      description: "Search page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");
  // console.log(result);
  return (
    <section>
      <h1 className="head-text mb-2 sm:mb-8">Search</h1>
      <SearchResults />
    </section>
  );
};

export default Page;
