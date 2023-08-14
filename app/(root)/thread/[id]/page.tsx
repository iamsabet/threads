import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import JumpTopButton from "@/components/shared/JumpTopButton";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id, userInfo?._id);

  if (!thread) return null;

  //   console.log(thread.author);
  //   console.log(thread.children);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={userInfo?.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={false}
          votes={thread.votes}
          myVote={thread.myVote}
        />
      </div>
      <div className="mt-6">
        <Comment
          threadId={thread._id}
          currentUserImage={userInfo?.image || user.imageUrl}
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
              currentUserId={userInfo?.id}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.children}
              isComment
              votes={comment.votes}
              myVote={comment.myVote}
            />
          );
        })}
      </div>
      <JumpTopButton />
    </section>
  );
};

export default Page;
