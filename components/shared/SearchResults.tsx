"use client";

import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import UsersCards from "./UsersCards";

const SearchResults = () => {
  const [searchString, setSearchString] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    console.log(searchString);
    // unmount and mount searchResults
    setFlash(false);
    setTimeout(() => {
      setFlash((_) => true);
    }, 2);
    return () => {};
  }, [searchString]);

  return (
    <>
      <Searchbar setSearchString={setSearchString} />
      {flash ? <UsersCards searchString={searchString} /> : <></>}
    </>
  );
};

export default SearchResults;
