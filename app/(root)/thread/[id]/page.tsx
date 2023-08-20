import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id, userInfo?._id);

  if (!thread) return notFound();

  //   console.log(thread.author);
  //   console.log(thread.children);

  return (
    <section className="relative">
      <div>
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
          isComment={false}
          isMainThread={true}
          votes={thread.votePoints}
          myVote={thread.myVote}
        />
      </div>
      <div className="mt-6">
        <Comment
          threadId={thread._id}
          currentUserImage={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
          currentUserName={userInfo?.name}
        />
      </div>
      <div className="mt-9">
        {thread.children.map((comment: any) => {
          return (
            <ThreadCard
              key={comment._id}
              id={comment._id}
              currentUserId={JSON.stringify(userInfo?._id)}
              repost={null}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              createdAt={comment.createdAt}
              comments={comment.children}
              isComment={true}
              isMainThread={false}
              votes={comment.votePoints}
              myVote={comment.myVote}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Page;
