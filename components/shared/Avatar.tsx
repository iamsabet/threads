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
  const loadingFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
      pulse={true}
      size={loadingSize}
      customClassNames={className}
    />
  );
  const replaceFrame = (
    <CharAvatar
      text={loadingText.toUpperCase()}
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
