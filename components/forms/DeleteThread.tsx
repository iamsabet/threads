"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/lib/actions/thread.actions";
import { useState } from "react";
import Spinner from "../Spinner";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  author_id: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  author_id,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // console.log(currentUserId, "???", authorId);

  if (currentUserId !== authorId) return null;

  return (
    <>
      {!loading ? (
        <Image
          src="/assets/delete_primary.svg"
          alt="delte"
          width={18}
          height={18}
          className="cursor-pointer object-contain hover:scale-110 transition-all duration-150 ease-in-out"
          onClick={async () => {
            setLoading((_) => true);
            await deleteThread(
              JSON.parse(threadId),
              JSON.parse(currentUserId),
              pathname
            );
            if (pathname.startsWith("/thread/")) {
              setLoading(false);
              router.push("/profile/" + author_id);
            } else if (!parentId || !isComment) {
              setLoading((_) => false);
              router.refresh();
            }
          }}
        />
      ) : (
        <Spinner size="18px" />
      )}
    </>
  );
}

export default DeleteThread;
