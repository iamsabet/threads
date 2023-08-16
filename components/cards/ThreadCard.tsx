import Link from "next/link";
import Image from "next/image";
import VoteBlock from "../threadActions/VoteBlock";
import HTMLReactParser from "html-react-parser";
import { formattedDateString } from "../shared/helpers";
import DeleteThread from "../forms/DeleteThread";
import { comment } from "postcss";
import RepostModal from "../modals/RepostModal";
interface ThreadProps {
  id: string;
  currentUserId: string;
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
  const parentThread: {
    _id: string;
    text: string;
    author: { _id: string; name: string; username: string; image: string };
  } | null = typeof parentId === "object" ? parentId : null;
  return (
    <article
      className={`flex w-full flex-col rounded-xl
    ${isComment ? "px-0 xs:px-7 mt-5" : "bg-dark-2 p-7"} `}
    >
      <div className="flex justify-between items-start">
        <div className="flex w-full flex-1 flex-row gap-2">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative w-11 h-11">
              <Image
                src={author.image}
                alt="profile image"
                fill
                // sizes=""
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div
              className={`thread-card_bar ${
                comments.length > 0 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-light-2 text-base-semibold">
                {author.name}
              </h4>
            </Link>
            {parentThread && (
              <Link
                href={`/thread/${
                  // @ts-ignore
                  parentThread?._id
                }
                `}
                className="w-fit"
              >
                <h5 className="text-subtle-medium text-light-3">
                  Replying to @
                  {
                    // @ts-ignore
                    parentThread.author.username
                  }
                </h5>
              </Link>
            )}
            <p className="mt-2 text-small-regular text-light-2">
              {HTMLReactParser(content)}
            </p>
            <div
              className={`${
                isComment && "gap-3 mb-2"
              } mt-4 flex flex-col gap-3`}
            >
              <div className="flex flex-row gap-3.5">
                {/* Vote Block */}
                <div className="flex items-center justify-cente gap-1">
                  <VoteBlock
                    threadId={JSON.stringify(id)}
                    voterId={currentUserId}
                    myVote={myVote ? myVote : ""}
                    votes={votes}
                  />
                </div>
                {/* Reply */}
                <Link
                  href={`/thread/${id}`}
                  className="flex flex-col items-center"
                >
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width="24"
                    height="24"
                    className="cursor-pointer object-contain my-auto transition-all duration-150 ease-in-out hover:scale-110"
                  />
                </Link>
                {/* Repost */}

                <RepostModal
                  threadId={id}
                  threadText={content}
                  authorId={author.id}
                  authorUsername={author.username}
                />
                {/* Share */}
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width="24"
                  height="24"
                  className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                />
                <DeleteThread
                  threadId={JSON.stringify(id)}
                  currentUserId={currentUserId}
                  authorId={JSON.stringify(author.id)}
                  parentId={parentId}
                  isComment={isComment}
                />
                {/* <Image
                  src="/assets/edit.svg"
                  alt="share"
                  width="24"
                  height="24"
                  className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                /> */}
              </div>
              {/* {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {comments.length > 0 && (
        <div
          className={`${comments.length === 1 && "ml-2.5"}
            ${comments.length === 2 && "ml-1"}
            ${comment.length >= 3 && "-ml-3"}
          } mt-2 flex items-center gap-3`}
        >
          {/* <div
            className={`${comments.length >= 3 ? "w-[22px]" : "w-[33px]"}`}
          ></div> */}
          {comments.slice(0, 3).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={26}
              height={26}
              className={`${
                index !== 0 && "-ml-7"
              } rounded-full object-contain ${
                comments.length >= 3 && index === 1 && "mb-7 z-[10]"
              }`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}
      <div className="">
        <h5 className="text-subtle-medium text-gray-1 mt-3">
          {formattedDateString(createdAt)}
        </h5>
      </div>
    </article>
  );
};

export default ThreadCard;
