"use server";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import SearchResults from "@/components/shared/SearchResults";
const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");
  // console.log(result);
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <SearchResults />
    </section>
  );
};

export default Page;
