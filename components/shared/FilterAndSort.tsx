"use server";

import Link from "next/link";
import React from "react";

const FilterAndSort = ({
  baseUrl,
  sortQuery,
  sortBy,
}: {
  baseUrl: string;
  sortQuery?: string;
  sortBy: string;
}) => {
  return (
    <div className="w-full flex flex-row justify-between pt-2">
      <div className="flex justify-start gap-2 items-center">
        <Link
          href={`/${sortQuery ? `?sortBy=${sortQuery}` : ""}`}
          className={`${baseUrl === "/" ? "link-activate" : "sort-by-link"}`}
        >
          Everybody
        </Link>
        <Link
          href={`/followings${sortQuery ? `?sortBy=${sortQuery}` : ""}`}
          className={`${
            baseUrl === "/followings" ? "link-activate" : "sort-by-link"
          }`}
        >
          Followings
        </Link>
      </div>
      <div className="flex justify-end gap-2 items-center">
        <Link
          href={`${baseUrl}?sortBy=latest`}
          className={`${
            sortBy === "createdAt" ? "link-activate" : "sort-by-link"
          }`}
        >
          Latest
        </Link>
        <Link
          href={`${baseUrl}?sortBy=top`}
          className={`${
            sortBy === "votePoints" ? "link-activate" : "sort-by-link"
          }`}
        >
          Top
        </Link>
      </div>
    </div>
  );
};

export default FilterAndSort;
