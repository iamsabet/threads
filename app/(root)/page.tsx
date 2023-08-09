import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const result = await fetchThreads({ pageNumber: 1, pageSize: 30 });
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-8 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result.threads.map((thread, ix) => {
              return (
                <ThreadCard
                  key={thread._id}
                  id={thread._id}
                  currentUserId={user?.id || ""}
                  parentId={thread.parentId}
                  content={thread.text}
                  author={thread.author}
                  community={thread.community}
                  createdAt={thread.createdAt}
                  comments={thread.children}
                  isComment={false}
                />
              );
            })}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
