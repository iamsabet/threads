"use client";

import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import { useAuth } from "@clerk/nextjs";
import usePagination from "@/hooks/usePagination";
import UserCard from "../cards/UserCard";
import Spinner from "../Spinner";

const SearchResults = () => {
  const { getToken } = useAuth();
  const [searchString, setSearchString] = useState("");
  const [loading, users, reset] = usePagination({
    options: {
      baseUrl: "/api/user/search",
      postFixQs: "&search=&sort=desc",
      pageSize: 20,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 1,
    },
    getToken: getToken,
  });
  const abortController = new AbortController();
  useEffect(() => {
    reset({ searchString, abortController });
    console.log(searchString);
    return () => {
      abortController.abort();
    };
  }, [searchString]);

  return (
    <>
      <Searchbar
        // searchString={searchString}
        setSearchString={setSearchString}
      />
      <div className="mt-12 flex flex-col gap-9 justify-center items-center">
        {
          // @ts-ignore
          users && users.length === 0 ? (
            <p className="no-result">No Users</p>
          ) : (
            <>
              {users && (
                <>
                  {
                    // @ts-ignore
                    users.map((person) => (
                      <UserCard
                        key={person.id}
                        user={person}
                        personType="User"
                      />
                    ))
                  }
                </>
              )}
            </>
          )
        }
      </div>
      <div className="w-full my-0 py-0 h-8 mt-5 flex justify-center">
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default SearchResults;
