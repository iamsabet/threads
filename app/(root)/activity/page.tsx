"use server";
import {
  fetchUser,
  getActivity,
  searchUsers,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import Link from "next/link";
const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

  // get activity
  const activities = await getActivity(userInfo?._id);

  const formattedDateString = (date: string) => {
    const newDate = new Date(date);

    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      year: "numeric",
    };

    return (
      newDate
        // @ts-ignore
        .toLocaleString("en-US", options)
        .split(", ")
        .reverse()
        .join(", ")
    );
  };
  return (
    <section>
      <h1 className="head-text mb-10">Activities</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities.length > 0 ? (
          <>
            {activities.map((act: any) => (
              <Link key={act._id} href={`/thread/${act.parentId}`}>
                <article className="activity-card">
                  <div className="flex flex-col">
                    <div className="flex justify-between overflow-hidden">
                      <Image
                        src={act.author.image}
                        alt="Profile Picture"
                        width="34"
                        height="34"
                        className="rounded-full object-cover mr-2"
                      />
                      <p className="!text-base-regular text-light-1 text-ellipsis line-clamp-2 mt-1">
                        <span className="mr-1 text-primary-500">
                          {act.author.name}
                        </span>{" "}
                        replied to your thread :
                        <span className="ml-1 text-light-2">{act.text}</span>
                      </p>
                    </div>
                    <div className="">
                      <h5 className="text-subtle-medium text-gray-1 mt-3">
                        {formattedDateString(act.createdAt)}
                      </h5>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Activity yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
