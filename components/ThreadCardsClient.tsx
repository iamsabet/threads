"use client";
import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import ThreadCard from "./cards/ThreadCard";
import Spinner from "./Spinner";

const ThreadCardsClient = ({
  result,
  currentUserId,
  baseUrl,
  label,
  isComment,
  sortBy,
  initialPage = 2,
}: {
  result?: string;
  currentUserId: string;
  baseUrl: string;
  label?: string;
  isComment: boolean;
  sortBy: SortByType;
  initialPage?: number;
}) => {
  try {
    if (result) result = JSON.parse(result);
    else result = "_";
    currentUserId = JSON.parse(currentUserId);
  } catch (e) {}
  const { getToken } = useAuth();
  const [loading, docs] = usePagination({
    options: {
      baseUrl: baseUrl,
      postFixQs: label
        ? `&label=${label}&sortBy=${sortBy}`
        : `&sortBy=${sortBy}`,
      pageSize: 10,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: initialPage,
    },
    getToken: getToken,
  });

  return (
    <>
      {result && (
        <>
          {docs?.length === 0 && (
            <h3 className="w-full mt-10 text-center">No {label} found</h3>
          )}
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
            <div
              className={`flex justify-center items-center ${
                initialPage === 1 ? "pb-30" : "pb-10"
              }`}
            >
              <Spinner />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ThreadCardsClient;
