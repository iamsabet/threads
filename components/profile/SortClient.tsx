"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
const SortClient = ({
  tab,
  sortBy,
  setSortBy,
}: {
  tab: string;
  sortBy: string;
  setSortBy: Function;
}) => {
  const baseUrl = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSortchange = (sortByVal: string) => {
    setSortBy(sortByVal);
    let tab = searchParams.get("tab");
    if (!tab) tab = "threads";

    switch (sortByVal) {
      case "createdAt":
        sortByVal = "latest";
        break;
      case "votePoints":
        sortByVal = "top";
        break;
      default:
        sortByVal = "latest";
        break;
    }

    router.push(`${baseUrl}?tab=${tab}&sort=${sortByVal}`, {
      scroll: false,
    });
  };
  return (
    <div className="w-full flex flex-row justify-between pt-2">
      <div className="flex justify-end gap-2 items-center">
        <Link
          href={`${baseUrl}?tab=${tab}&sort=latest`}
          className={`w-20 ${
            sortBy === "createdAt" ? "link-activate" : "sort-by-link"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleSortchange("createdAt");
          }}
        >
          Latest
        </Link>
        <Link
          href={`${baseUrl}?tab=${tab}&sort=top`}
          className={`w-20 ${
            sortBy === "votePoints" ? "link-activate" : "sort-by-link"
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleSortchange("votePoints");
          }}
        >
          Top
        </Link>
      </div>
    </div>
  );
};
export default SortClient;
