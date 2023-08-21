import ThreadCardsClient from "@/components/ThreadCardsClient";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const Home = async () => {
  const user = await currentUser();
  if (user) {
    var userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) return redirect("/onboarding");
  }
  const sortBy: SortByType = "votePoints";
  const result = await fetchThreads({
    pageNumber: 1,
    pageSize: 10,
    currentUserId: userInfo ? userInfo?._id : null,
    sortBy: sortBy,
  });

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-5 flex flex-col gap-5">
        {result.docs?.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result.docs?.map((thread: any) => {
              return (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={JSON.stringify(userInfo?._id)}
                  repost={JSON.stringify(thread.repost)}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                  votes={thread.votePoints}
                  myVote={thread.myVote}
                  isComment={false}
                />
              );
            })}
            {result.hasNext && (
              <ThreadCardsClient
                currentUserId={JSON.stringify(userInfo?._id)}
                baseUrl="/api/thread"
                isComment={false}
                sortBy={sortBy}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
