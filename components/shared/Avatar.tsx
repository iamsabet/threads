import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Suspense } from "react";
const Avatar = ({
  src,
  loadingSize,
  loadingText,
  alt,
  width,
  height,
  className,
}: {
  src: string | StaticImport;
  loadingSize?: "6xl" | "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg";
  loadingText: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const loadingFrame = (
    <div
      role="status"
      className={`animate-pulse rounded-full w-full h-full flex justify-center items-center text-light-2 bg-primary-500 font-bold ${
        loadingSize ? `text-[40px]` : "text-2xl"
      } ${className}`}
    >
      {loadingText.toUpperCase()}
    </div>
  );

  const replaceFrame = (
    <div
      role="status"
      className={`rounded-full w-full h-full flex justify-center items-center text-light-2 bg-primary-500 font-bold ${
        loadingSize ? `text-[40px]` : "text-2xl"
      } ${className}`}
    >
      {loadingText.toUpperCase()}
    </div>
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
              className="rounded-full object-cover shadow-2xl"
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              // sizes=""
              className="rounded-full object-cover shadow-2xl"
            />
          )}
        </Suspense>
      )}
    </>
  );
};

export default Avatar;
