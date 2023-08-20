"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Avatar from "../shared/Avatar";

interface FollowPageButtonType {
  accountUsername: string;
  src: string;
}

const ProfileAvatarModal = ({ accountUsername, src }: FollowPageButtonType) => {
  const [showModalConfirmation, setShowModalConfirmation] = useState(false);

  const handleShowModal = (state: boolean) => {
    setShowModalConfirmation(state);
  };

  return (
    <>
      {/* handle click */}
      {src && src !== "" ? (
        <Dialog
          open={showModalConfirmation}
          onOpenChange={setShowModalConfirmation}
        >
          <DialogTrigger asChild className="w-24 h-24">
            <button
              className="bg-transparent rounded-full w-24 h-24"
              onClick={() => {
                handleShowModal(true);
              }}
            >
              <Avatar
                src={src}
                alt="Profile Image"
                loadingSize="big"
                loadingText={accountUsername.charAt(0)}
              />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[430px] bg-dark-2 outline-none border-light-3 shadow-lg px-3 justify-center items-center">
            <Avatar
              src={src}
              alt="Profile Image"
              width={300}
              height={300}
              loadingSize="big"
              loadingText={accountUsername.charAt(0)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Avatar
          src={src}
          alt="Profile Image"
          loadingSize="big"
          loadingText={accountUsername.charAt(0)}
        />
      )}
    </>
  );
};

export default ProfileAvatarModal;
