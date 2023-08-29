import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  if (!params.id) return {};
  const parentData = await parent;
  const user = await currentUser();
  const host = parentData.metadataBase;
  if (!user) return {};
  const userInfo = await fetchUser(user.id);
  const thread = await fetchThreadById(params.id, userInfo?._id);

  if (!thread) return notFound();

  return {
    title: `${userInfo.name} (@${userInfo.username})'s Thread on Hex-Threads`, // change My App to your app name
    description: thread.text,
    icons: userInfo.profileImage, // Make sure the URL is absolute
    openGraph: {
      type: "website",
      url: `${host}thread/${thread._id.toString()}`, // Edit to your app URL
      title: `${userInfo.name} (@${userInfo.username})'s Thread on Hex-Threads`,
      description: thread.text,
      images: [
        {
          url: userInfo.image, // Make sure the URL is absolute
          width: 200,
          height: 200,
          alt: `Profile picture of ${userInfo.username}`,
        },
      ],
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}

const Page = async ({ params }: Props) => {
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
          currentUserColor={userInfo?.color}
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
