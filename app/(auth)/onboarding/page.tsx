import { AccountProfile } from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;
  const user = await currentUser();
  if (!user) return {};
  const userInfo = await fetchUser(user.id);
  if (userInfo && userInfo.onboarded) return {};

  return {
    title: `Onboarding of (@${userInfo.username}) on Hex-Threads`, // change My App to your app name
    description: userInfo.bio,
    icons: userInfo.profileImage, // Make sure the URL is absolute
    openGraph: {
      type: "website",
      url: `${host}profile/${userInfo.id}`, // Edit to your app URL
      title: `Onboarding of (@${userInfo.username}) on Hex-Threads`,
      description: userInfo.bio,
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

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (userInfo && userInfo.onboarded) return redirect("/");

  // TODO: on update username must update the username with Clerk as well
  // or else its gonna go out of sync

  const userData = {
    id: user?.id,
    objectId: userInfo?.id,
    username: userInfo?.username || user?.username,
    email: userInfo?.email || user?.emailAddresses[0].emailAddress,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image:
      userInfo && userInfo?.image.length > 0 ? userInfo?.image : user.imageUrl,
  };
  return (
    <main className="mx-auto flex flex-col justify-start px-10 py-20 max-w-3xl">
      <h1 className="head-text"> Onboarding </h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Submit & Continue" />
      </section>
    </main>
  );
};
export default Page;
