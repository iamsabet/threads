"use client";
import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import React from "react";
import ThreadCard from "./cards/ThreadCard";
import Spinner from "./Spinner";

const ThreadCardsClient = ({
  currentUserId,
  baseUrl,
  label,
  isComment,
}: {
  currentUserId: string;
  baseUrl: string;
  label?: string;
  isComment: boolean;
}) => {
  try {
    currentUserId = JSON.parse(currentUserId);
  } catch (e) {}
  const { getToken } = useAuth();
  const [loading, docs] = usePagination({
    options: {
      baseUrl: baseUrl,
      postFixQs: label ? `&label=${label}` : "",
      pageSize: 10,
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
            votes={thread.votePoints}
            myVote={thread.myVote}
            isComment={isComment}
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
