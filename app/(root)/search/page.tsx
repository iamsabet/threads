"use server";
import { fetchUser, searchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import UserCard from "@/components/cards/UserCard";
const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

  const result = await searchUsers({
    pageNumber: 1,
    pageSize: 30,
    sortBy: "desc",
    userId: userInfo?.id,
    searchString: "",
  });
  // console.log(result);
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {/* Search bar */}
      <div className="mt-12 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard key={person.id} user={person} personType="User" />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
