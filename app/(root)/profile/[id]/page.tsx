"use server";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, fetchUserThreads } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import ThreadsTab from "@/components/shared/ThreadsTab";
import JumpTopButton from "@/components/shared/JumpTopButton";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const current_user = await fetchUser(user.id);
  if (!current_user) return redirect("/sign-in");
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

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
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        img={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => {
              return (
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                  <Image
                    src={tab.icon}
                    alt="Tab Label"
                    width="24"
                    height="24"
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>

                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {
                      // @ts-ignore
                      results[tab.value].docs.length
                    }
                  </p>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <TabsContent
                key={`content-${tab.label}`}
                value={tab.value}
                className="w-full text-light-1"
              >
                <ThreadsTab
                  currentUserId={JSON.stringify(current_user._id)}
                  accountId={userInfo?._id}
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
      <JumpTopButton />
    </section>
  );
};

export default Page;
