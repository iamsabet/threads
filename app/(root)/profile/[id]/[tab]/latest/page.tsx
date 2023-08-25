"use server";

import React from "react";
import Page from "../../page";

const page = (params: {
  params: { id: string; tab: string; sort: string };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  return <Page params={params.params} />;
};

export default page;
