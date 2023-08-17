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
  const result = await fetchThreads({
    pageNumber: 1,
    pageSize: 20,
    currentUserId: userInfo ? userInfo?._id : null,
  });

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-8 flex flex-col gap-10">
        {result.docs.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result.docs.map((thread: any) => {
              return (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={JSON.stringify(userInfo?._id)}
                  repost={JSON.stringify(thread.repost)}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
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
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
