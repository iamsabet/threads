import ThreadCard from "@/components/cards/ThreadCard";
import JumpTopButton from "@/components/shared/JumpTopButton";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const user = await currentUser();
  if (user) {
    var userInfo = await fetchUser(user.id);
  }
  const result = await fetchThreads({
    pageNumber: 1,
    pageSize: 30,
    currentUserId: userInfo ? userInfo?._id : null,
  });

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-8 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result.threads.map((thread: any) => {
              return (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={userInfo ? userInfo?._id : null}
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
          </>
        )}
      </section>
      <JumpTopButton />
    </>
  );
};

export default Home;
