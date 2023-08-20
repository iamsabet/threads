"use client";
import { digitalRainbowColors } from "@/constants";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Suspense, useMemo } from "react";
import CharAvatar from "./CharAvatar";
import { getContrastingColor } from "./helpers";
const Avatar = ({
  src,
  loadingSize,
  loadingText = "small",
  alt,
  width,
  height,
  className,
}: {
  src: string | StaticImport;
  loadingSize?: "big" | "small";
  loadingText: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const randomColorKey = (min: number, max: number) => {
    return Math.floor(Math.random() * max) + min;
  };

  const bg_color = useMemo(
    () => digitalRainbowColors[randomColorKey(1, 20)],
    []
  );
  const textColor = useMemo(() => getContrastingColor(bg_color), [bg_color]);
  const loadingFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
      bg_color={bg_color}
      textColor={textColor}
      pulse={true}
      size={loadingSize}
      customClassNames={className}
    />
  );
  const replaceFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
      bg_color={bg_color}
      textColor={textColor}
      pulse={false}
      size={loadingSize}
      customClassNames={className}
    />
  );
  // return loadingFrame;
  return (
    <>
      {src === "" ? (
        replaceFrame
      ) : (
        <Suspense fallback={loadingFrame}>
          {width && height ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              // sizes=""
              className={`rounded-full object-cover shadow-2xl ${className}`}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              // sizes=""
              className={`rounded-full object-cover shadow-2xl ${className}`}
            />
          )}
        </Suspense>
      )}
    </>
  );
};

export default Avatar;
