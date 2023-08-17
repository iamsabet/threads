import React from "react";
import Image from "next/image";
import Link from "next/link";
interface UserCardProps {
  user: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
  personType: string;
}
const UserCard = ({ user, personType }: UserCardProps) => {
  const { id, name, username, image } = user;
  return (
    <article className="user-card w-full">
      <Image
        src={image}
        alt="Profile Picture"
        width="48"
        height="48"
        className="rounded-full object-contain"
      />
      <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-light-1">{name}</h4>
        <p className="text-small-medium text-gray-1">@{username}</p>
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
