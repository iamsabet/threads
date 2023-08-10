import Link from "next/link";
import Image from "next/image";
import VoteBlock from "../threadActions/VoteBlock";
interface ThreadProps {
  id: string;
  currentUserId: string | undefined;
  parentId: string;
  content: string;
  author: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
  votes: number;
  myVote?: VoteType;
}
const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  votes,
  myVote,
}: ThreadProps) => {
  const createdAtFormatted = createdAt.split(".")[0].split("T").join(" ");
  return (
    <article
      className={`flex w-full flex-col rounded-xl
    ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"} `}
    >
      <div className="flex justify-between items-start">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative w-11 h-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-2 text-base-semibold">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div
              className={`${
                isComment && "gap-3 mb-8"
              } mt-4 flex flex-col gap-3`}
            >
              <div className="flex flex-row gap-3.5">
                <VoteBlock
                  threadId={JSON.stringify(id)}
                  voterId={JSON.stringify(currentUserId)}
                  myVote={myVote ? myVote : ""}
                  votes={votes}
                />

                {/* Reply */}
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width="24"
                    height="24"
                    className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                  />
                </Link>
                {/* Repost */}
                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width="24"
                  height="24"
                  className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                />
                {/* Share */}
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width="24"
                  height="24"
                  className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                />
              </div>
              {
                // isComment &&
                comments.length > 0 && (
                  <Link href={`/thread/${id}`}>
                    <p className="text-subtle-medium text-gray-1">
                      {comments.length} replies
                    </p>
                  </Link>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h4 className="text-light-3 text-base-semibold">{createdAt}</h4>
      </div>
    </article>
  );
};

export default ThreadCard;
