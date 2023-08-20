import React from "react";
import Image from "next/image";
import Link from "next/link";
import HTMLReactParser from "html-react-parser";
import { parseFoundText } from "../utils";
import Avatar from "../shared/Avatar";
interface UserCardProps {
  user: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
  type: string;
  searchString: string;
}

const UserCard = ({ user, type, searchString }: UserCardProps) => {
  const { id, name, username, image } = user;

  const parsedName =
    searchString && searchString.length && type === "search"
      ? parseFoundText(name, searchString)
      : name;

  const parsedUserName =
    searchString && searchString.length && type === "search"
      ? parseFoundText(username, searchString)
      : username;

  return (
    <article className="user-card w-full">
      <div className="flex flex-row gap-2">
        <div className="w-10 h-10">
          <Avatar
            src={image}
            alt="Profile Picture"
            width={42}
            height={42}
            loadingText={parsedUserName.toString().charAt(0)}
          />
        </div>
        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1 text-ellipsis line-clamp-1 max-w-[150px] xs:max-w-[230px]">
            {parsedName}
          </h4>
          <p className="text-small-medium text-gray-1 text-ellipsis line-clamp-1 max-w-[150px] xs:max-w-[230px]">
            @{parsedUserName}
          </p>
        </div>
      </div>

      <Link
        className="user-card_btn px-4 py-2 text-center text-body-bold"
        href={`/profile/${id}`}
      >
        View
      </Link>
      {/* <Button className="user-card_btn">View</Button> */}
    </article>
  );
};

export default UserCard;
