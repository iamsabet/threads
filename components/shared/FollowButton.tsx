"use client";

import { useState } from "react";
import Image from "next/image";
const FollowButton = () => {
  const [follow, setFollow] = useState<boolean>(false);

  const followButtonHandler = () => {
    setFollow((_prev) => !_prev);
  };

  return (
    <button onClick={followButtonHandler}>
      <div
        className="flex cursor-pointer gap-3 rounded-lg shadow-lg transition-colors duration-200 ease-in-out 
              bg-dark-3 px-4 py-2 hover:bg-primary-500 hover:bg-opacity-20"
      >
        <Image src="/assets/edit.svg" alt="logout" width={16} height={16} />

        <p className="text-light-2 max-sm:hidden">
          {" "}
          {follow ? "Unfollow" : "Follow"}
        </p>
      </div>
    </button>
  );
};

export default FollowButton;
