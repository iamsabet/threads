import React from "react";
import Image from "next/image";
const ActivityIcon = ({
  type,
  message,
  styles,
}: {
  type: string;
  message: string;
  styles: string;
}) => {
  return (
    <span
      className={`${styles} flex justify-center items-center pr-1.5 w-[35px] overflow-hidden`}
    >
      {type === "vote" && (
        <Image
          src={`/assets/arrow_${message.split(" ")[0].split("vote")[0]}.svg`}
          alt={`${message.split(" ")[0]} icon`}
          width="19"
          height="19"
          className="cursor-pointer w-[19px] h-auto object-contain transition-all duration-150 ease-in-out hover:scale-110"
        />
      )}
      {type === "reply" && (
        <Image
          src="/assets/reply.svg"
          alt="reply"
          width="30"
          height="30"
          className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
        />
      )}
      {type === "mention" && (
        <Image
          src="/assets/atsign.svg"
          alt="mention"
          width="30"
          height="30"
          className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
        />
      )}
    </span>
  );
};

export default ActivityIcon;
