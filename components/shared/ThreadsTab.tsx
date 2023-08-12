import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
interface ThreadsTabsPropsType {
  currentUserId: string;
  accountId: string;
  accountType: string;
  label: string;
}
const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
  label,
}: ThreadsTabsPropsType) => {
  console.log("Label = " + label);

  let result = await fetchUserThreads({
    pageNumber: 1,
    pageSize: 30,
    currentUserId: currentUserId,
    accountId: accountId,
    label:label,
  });
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={{
              name: thread.author.name,
              image: thread.author.image,
              username: thread.author.username,
              id: thread.author._id,
            }} // TODO: check owner or not
            community={thread.community} // TODO: check owner or not
            createdAt={thread.createdAt}
            comments={thread.children}
            isComment
            votes={thread.votes}
            myVote={thread.myVote}
            // votes={0}
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
