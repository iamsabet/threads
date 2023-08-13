"use client";
import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import ThreadCard from "./cards/ThreadCard";
import Spinner from "./Spinner";

const ThreadCardsClient = ({ currentUserId }: { currentUserId?: string }) => {
  const { getToken } = useAuth();
  const [loading, docs] = usePagination({
    options: {
      baseUrl: "/api/thread",
      pageSize: 20,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 2,
    },
    getToken: getToken,
  });
  return (
    <>
      {docs?.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={thread.author}
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            votes={thread.votes}
            myVote={thread.myVote}
            isComment={false}
          />
        );
      })}
      {loading && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ThreadCardsClient;
