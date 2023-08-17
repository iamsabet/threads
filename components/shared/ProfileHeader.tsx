import React from "react";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";
interface PropsType {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  img: string;
  bio: string;
}
const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  username,
  img,
  bio,
}: PropsType) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={img}
              alt="Profile Image"
              fill
              // sizes=""
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
        {accountId === authUserId && (
          <Link href="/profile/edit">
            <div
              className="flex cursor-pointer gap-3 rounded-lg shadow-lg transition-colors duration-200 ease-in-out 
              bg-dark-3 px-4 py-2 hover:bg-primary-500 hover:bg-opacity-20"
            >
              <Image
                src="/assets/edit.svg"
                alt="logout"
                width={16}
                height={16}
              />

              <p className="text-light-2 max-sm:hidden">Edit</p>
            </div>
          </Link>
        )}
        {accountId !== authUserId && <FollowButton />}
      </div>
      <div className="w-full">
        <p className="mt-6 w-full text-justify text-base-regular text-light-2">
          {bio}
        </p>
      </div>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
