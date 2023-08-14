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
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  console.log(currentUserId, "?", authorId);
  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <>
      {!loading ? (
        <Image
          src="/assets/delete.svg"
          alt="delte"
          width={18}
          height={18}
          className="cursor-pointer object-contain"
          onClick={async () => {
            setLoading((_) => true);
            await deleteThread(JSON.parse(threadId), pathname);
            if (!parentId || !isComment) {
              setLoading((_) => false);
              router.refresh();
            }
          }}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default DeleteThread;
