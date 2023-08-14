"use client";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";

const ThreadsTab = ({
  currentUserId,
  accountId,
  accountType,
  label,
  threadsResult,
}: ThreadsTabsPropsType) => {
  // console.log("Label = " + label);

  if (!threadsResult) redirect("/");
  if (label === "replies") {
    console.log("s");
  }
  return (
    <section className="mt-9 flex flex-col gap-10">
      {threadsResult.docs.map((thread: any) => {
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
