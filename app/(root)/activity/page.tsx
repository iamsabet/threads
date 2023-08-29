"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ActivitiesComponent from "@/components/activity/page";

import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Activity in Hex-Threads`, // change My App to your app name
    description: "Activity page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}activity`, // Edit to your app URL
      title: `Activity in Hex-Threads`,
      description: "Activity page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}

const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        <ActivitiesComponent />
      </section>
    </section>
  );
};

export default Page;
