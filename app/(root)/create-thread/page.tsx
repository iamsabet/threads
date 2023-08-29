import { PostThread } from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Post a Thread in Hex-Threads`, // change My App to your app name
    description: "Post Thread page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}create-thread`, // Edit to your app URL
      title: `Post a Thread in Hex-Threads`,
      description: "Post Thread page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}
const Page = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) return redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo?._id.toString()} user_id={user.id} />
    </>
  );
};
export default Page;
