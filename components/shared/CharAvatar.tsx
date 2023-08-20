import React from "react";

const CharAvatar = ({
  text,
  customClassNames,
  bg_color,
  textColor,
  pulse,
  size,
}: {
  text: string;
  customClassNames?: string;
  size?: string;
  pulse: boolean;
  bg_color: string;
  textColor: string;
}) => {
  return (
    <div
      role="status"
      className={`${
        pulse ? "animate-pulse" : ""
      } rounded-full w-full h-full flex justify-center items-center font-semibold ${
        size ? `text-[40px]` : "text-2xl"
      } ${customClassNames}`}
      style={{
        backgroundColor: bg_color,
        color: textColor,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};

export default CharAvatar;
