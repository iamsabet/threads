"use client";
import { digitalRainbowColors } from "@/constants";
import React, { useMemo } from "react";
import { getContrastingColor } from "./helpers";

const CharAvatar = ({
  text,
  customClassNames,
  pulse,
  size,
}: {
  text: string;
  customClassNames?: string;
  size?: string;
  pulse: boolean;
}) => {
  const randomColorKey = (min: number, max: number) => {
    return Math.floor(Math.random() * max) + min;
  };

  const bg_color = useMemo(
    () => digitalRainbowColors[randomColorKey(1, 20)],
    []
  );
  const textColor = useMemo(() => getContrastingColor(bg_color), []);
  return (
    <div
      role="status"
      className={`${customClassNames} ${
        pulse ? "animate-pulse" : ""
      } rounded-full w-full h-full flex justify-center items-center font-semibold ${
        size ? `text-[43px]` : `text-[24px]`
      }`}
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
