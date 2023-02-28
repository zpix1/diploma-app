import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const {
    data: searchResult,
    status,
    error,
    refetch,
  } = api.search.doSearch.useQuery(
    {},
    {
      enabled: false,
    }
  );

  return (
    <>
      <Head>
        <title>DEX Arbitrageur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {status}
        <input type="button" onClick={() => refetch()} value="Do search" />
      </main>
    </>
  );
};

export default Home;
