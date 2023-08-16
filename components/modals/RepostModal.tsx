"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HTMLReactParser from "html-react-parser";
import { ThemeProvider } from "../theme/theme.-provider";

interface RepostProps {
  threadId: string;
  threadText: string;
  authorUsername: string;
  authorId: string;
}

const RepostModal = ({
  threadId,
  threadText,
  authorUsername,
  authorId,
}: RepostProps) => {
  const [showRepostConfirmation, setShowRepostConfirmation] =
    React.useState(false);

  const handleRepostClick = (state: boolean) => {
    setShowRepostConfirmation(state);
  };

  const handleCancelRepost = () => {
    handleRepostClick(false);
    setShowRepostConfirmation(false);
  };

  const handleRepost = () => {
    // Perform the Repost action here -> post create-thread action with extra repost thread_id
    // .
    handleRepostClick(false);
    setShowRepostConfirmation(false);
  };

  return (
    // <ThemeProvider attribute="class" defaultTheme="dark">
    <Dialog
      open={showRepostConfirmation}
      onOpenChange={setShowRepostConfirmation}
    >
      <DialogTrigger asChild>
        <Button
          className="outline-none bg-transparent w-fit py-1 px-0 hover:bg-transparent"
          onClick={() => handleRepostClick(true)}
        >
          <Image
            src="/assets/repost_2.svg"
            alt="repost"
            width="24"
            height="24"
            className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-dark-2 outline-none border-light-3 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-light-1 flex items-center justify-start gap-2">
            <Image
              src="/assets/repost_2.svg"
              alt="repost"
              width="30"
              height="30"
              className="object-contain"
            />
            <p className="text-[18px]"> Repost Thread</p>
          </DialogTitle>
          <DialogDescription className="text-light-2 mt-2 text-[15px]">
            Are you sure you want to repost this thread by{" "}
            <span className="text-primary-500">@{authorUsername}</span> ?
          </DialogDescription>
        </DialogHeader>
        <div className="pb-4">
          {/* Your existing profile fields */}
          <p className="w-full text-light-2 text-ellipsis line-clamp-3 text-subtle-medium">
            <span className="text-subtle-semibold text-light-3">content :</span>{" "}
            {HTMLReactParser(threadText)}
          </p>
        </div>
        <DialogFooter>
          <Button
            className="text-dark-1 bg-light-1 hover:bg-gray-400 mt-2"
            onClick={handleCancelRepost}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRepost}
            className="text-light-1 bg-primary-500 hover:bg-secondary-500 hover:text-dark-1 mt-2"
          >
            Repost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    // </ThemeProvider>
  );
};

export default RepostModal;
