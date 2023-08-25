"use server";

import React from "react";
import Page from "../../page";

const page = (params: {
  params: { id: string };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  return <Page params={params.params} />;
};

export default page;
