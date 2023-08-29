import ThreadCardsClient from "@/components/ThreadCardsClient";
import ThreadCard from "@/components/cards/ThreadCard";
import FilterAndSort from "@/components/shared/FilterAndSort";
import FilterComponent from "@/components/shared/FilterComponent";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Metadata, ResolvingMetadata } from "next";
export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const parentData = await parent;
  const host = parentData.metadataBase;

  return {
    title: `Hex-Threads`, // change My App to your app name
    description: "Home page of Hex-Threads",
    openGraph: {
      type: "website",
      url: `${host}`, // Edit to your app URL
      title: `Hex-Threads`,
      description: "Home page of Hex-Threads",
      siteName: "Hex-Threads", // change My App to your actual app name
    },
  };
}
const Home = async (params: {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const user = await currentUser();
  if (user) {
    var userInfo = await fetchUser(user.id);
    // if (!userInfo?.onboarded) return redirect("/onboarding");
  }
  let sortBy: SortByType = "votePoints";

  let sortQuery = params?.searchParams?.sortBy as string | undefined;
  if (sortQuery && sortQuery === "latest") {
    sortBy = "createdAt";
  } else if (!sortQuery || sortQuery === "top") {
    sortBy = "votePoints";
  }
  const result = await fetchThreads({
    pageNumber: 1,
    pageSize: 10,
    currentUserId: userInfo ? userInfo?._id : null,
    sortBy: sortBy,
  });

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="head-text text-left">Threads by</h1>
        <FilterComponent
          baseUrl={"/"}
          sortQuery={sortQuery}
          sortBy={sortBy}
          type="smallDevice"
        />
      </div>

      <FilterAndSort baseUrl={"/"} sortQuery={sortQuery} sortBy={sortBy} />

      <section className="mt-5 flex flex-col gap-5">
        {result && result.docs?.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result &&
              result.docs?.map((thread: any) => {
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
            {/* DOES NOT REBUILD ON router link change so we need to split them for sortBy   */}
            {sortBy === "votePoints" && (
              <ThreadCardsClient
                result={JSON.stringify(result)}
                currentUserId={JSON.stringify(userInfo?._id)}
                baseUrl="/api/thread"
                isComment={false}
                sortBy={"votePoints"}
              />
            )}
            {sortBy === "createdAt" && (
              <ThreadCardsClient
                result={JSON.stringify(result)}
                currentUserId={JSON.stringify(userInfo?._id)}
                baseUrl="/api/thread"
                isComment={false}
                sortBy={"createdAt"}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
