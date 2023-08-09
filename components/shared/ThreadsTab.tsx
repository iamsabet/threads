import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard";
interface ThreadsTabsPropsType {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
const ThreadsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: ThreadsTabsPropsType) => {
  let result = await fetchUserThreads(accountId);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread: any) => {
        return (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId || ""}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? {
                    name: result.name,
                    image: result.image,
                    username: result.username,
                    id: result.id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    username: thread.author.username,
                    id: thread.author.id,
                  }
            } // TODO: check owner or not
            community={thread.community} // TODO: check owner or not
            createdAt={thread.createdAt}
            comments={thread.children}
            isComment
          />
        );
      })}
    </section>
  );
};

export default ThreadsTab;
