"use client";
import { RiUserFollowFill, RiUserUnfollowFill } from "react-icons/ri";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";
import { usePathname } from "next/navigation";
const FollowButton = ({
  account_id,
  init_follow,
}: {
  account_id: string;
  init_follow: boolean;
}) => {
  const [follow, setFollow] = useState<boolean>(init_follow);
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  try {
    account_id = JSON.parse(account_id);
  } catch (e) {}
  const { getToken } = useAuth();
  const followButtonHandler = () => {
    setFollow((prev) => {
      if (prev) {
        callFollowApi("unfollow");
      } else {
        callFollowApi("follow");
      }
      return !prev;
    });
  };

  const callFollowApi = async (type: string) => {
    setLoading((_) => true);
    let headers: { Authorization?: string; "Content-Type": string } = {
      "Content-Type": "application/json",
    };
    const token = await getToken();

    if (token) headers["Authorization"] = `Bearer ${token}`;
    await fetch(`/api/follow`, {
      method: "POST",
      headers: headers,
      cache: "no-cache",
      body: JSON.stringify({
        following: account_id,
        type: type,
        path: pathname,
      }),
    });

    updateFollowersCountNonReactMethod("followers-btn", type);

    setLoading((_) => false);
  };

  const updateFollowersCountNonReactMethod = (id: string, type: string) => {
    const inc_val = type === "follow" ? 1 : -1;
    const element = document.getElementById(id);
    // @ts-ignore
    const innerVal = parseInt(element?.innerText.split(" ")[0]);
    const val = (innerVal + inc_val).toString() + " Followers";
    if (element) {
      // @ts-ignore
      element.innerHTML = val;
    }
  };

  return (
    <button onClick={followButtonHandler} disabled={loading} className="w-18">
      <div
        className={`flex w-[120px] max-sm:w-fit cursor-pointer gap-2 items-center justify-around rounded-lg shadow-lg transition-colors duration-200 ease-in-out 
               px-2 py-2 ${
                 !follow
                   ? "bg-dark-3 hover:bg-primary-500 hover:bg-opacity-30"
                   : "bg-light-1 bg-opacity-90 hover:bg-opacity-80"
               }`}
      >
        <span className="text-primary-500 w-fit">
          {loading ? (
            <div className="h-full flex-col justify-center items-center">
              <Spinner size={"small"} />
            </div>
          ) : follow ? (
            <RiUserUnfollowFill size="22" />
          ) : (
            <RiUserFollowFill size="22" />
          )}
        </span>

        <p
          className={`${
            !follow ? "text-light-2" : "text-dark-2"
          } max-sm:hidden text-left`}
        >
          {follow ? "Unfollow" : "Follow"}
        </p>
      </div>
    </button>
  );
};

export default FollowButton;
