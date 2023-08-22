"use client";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
import ThreadCardsClient from "../ThreadCardsClient";

const ThreadsTab = ({
  currentUserId,
  accountId,
  accountType,
  label,
  threadsResult,
}: ThreadsTabsPropsType) => {
  // console.log("Label = " + label);
  const sortBy: SortByType = "createdAt";

  if (!threadsResult) redirect("/");

  try {
    accountId = JSON.parse(accountId);
  } catch (e) {}
  return (
    <section className="mt-9 flex flex-col gap-10">
      {threadsResult.docs.length === 0 && (
        <h3 className="w-full mt-10 text-center">No {label} found</h3>
      )}
      {threadsResult.docs.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            repost={JSON.stringify(thread.repost)}
            parentId={thread.parentId}
            content={thread.text}
            author={{
              name: thread.author.name,
              image: thread.author.image,
              username: thread.author.username,
              id: thread.author.id,
              _id: thread.author._id,
            }} // TODO: check owner or not
            createdAt={thread.createdAt}
            comments={thread.children}
            isComment
            votes={thread.votePoints}
            myVote={thread.myVote}
          />
        );
      })}
      {threadsResult.hasNext && (
        <ThreadCardsClient
          result={JSON.stringify(threadsResult)}
          currentUserId={currentUserId}
          baseUrl={`/api/account-threads/${accountId}`}
          label={label}
          isComment={true}
          sortBy={sortBy}
        />
      )}
    </section>
  );
};

export default ThreadsTab;
