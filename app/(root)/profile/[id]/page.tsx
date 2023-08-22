"use server";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import {
  fetchUser,
  fetchUserAccount,
  fetchUserThreads,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import React, { useMemo } from "react";
import ThreadsTab from "@/components/shared/ThreadsTab";
import TabsTriggerClient from "@/components/profile/TabTriggerClient";
import TabTriggerClient from "@/components/profile/TabTriggerClient";
import FilterAndSort from "@/components/shared/FilterAndSort";

const Page = async (params: {
  params: { id: string };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const user = await currentUser();

  if (!user) return null;

  const current_user = await fetchUser(user.id);
  if (!current_user) return redirect("/sign-in");
  if (!current_user?.onboarded) return redirect("/onboarding");
  const userInfo = await fetchUserAccount(params.params.id, current_user._id);
  if (!userInfo) return notFound();

  const setDefaultTab = () => {
    if (params.searchParams) {
      if (params.searchParams.tab) {
        return params.searchParams.tab as string;
      }
      return "threads";
    }
    return "threads";
  };

  const defaultTab = setDefaultTab();

  let results: {
    threads: any;
    replies: any;
    mentioned: any;
  } = {
    threads: {},
    replies: {},
    mentioned: {},
  };
  for (let p in profileTabs) {
    let value = profileTabs[p].value;
    // @ts-ignore
    results[value] = await fetchUserThreads({
      pageNumber: 1,
      pageSize: 10,
      currentUserId: current_user._id,
      accountId: userInfo._id,
      label: value,
    });
  }
  return (
    <section className="">
      <ProfileHeader
        accountId={userInfo.id}
        account_id={userInfo._id}
        authUserId={current_user.id}
        authUser_id={current_user._id}
        name={userInfo.name}
        username={userInfo.username}
        followersCount={userInfo?.followersCount}
        followingsCount={userInfo?.followingsCount}
        follow={userInfo?.follow} // do i follow or not
        img={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-2 sm:mt-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="tab rounded-xl px-0 mx-0">
            <>
              {profileTabs.map((tab) => {
                return (
                  <TabTriggerClient
                    tab={tab}
                    total={
                      // @ts-ignore
                      results[tab.value].totalThreadsCount
                    }
                  />
                );
              })}
            </>
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                <FilterAndSort
                  baseUrl={"/profile/" + current_user.id}
                  sortBy=""
                />
                <ThreadsTab
                  currentUserId={JSON.stringify(current_user._id)}
                  accountId={JSON.stringify(userInfo?._id)}
                  label={tab.value}
                  accountType="User"
                  // @ts-ignore
                  threadsResult={results[tab.value]}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
