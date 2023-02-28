import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { ResultsTable } from "~/components/ResultsTable";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const {
    data: searchResult,
    status,
    error,
    mutate,
  } = api.search.doSearch.useMutation();

  const performRequest = () => mutate({});

  const buttonText =
    status === "loading"
      ? "Loading..."
      : status === "success"
      ? "Do Search Again"
      : "Do Search";

  return (
    <>
      <Head>
        <title>DEX Arbitrageur</title>
      </Head>
      <div className="center pt-5 text-center text-2xl">DEX Arbitrageur</div>
      <main className="m-auto mt-5 max-w-6xl rounded bg-slate-300 p-5">
        <div className="pb-1 text-xl">Status: </div>
        <div className="rounded bg-slate-200 p-5">
          {status === "success" ? (
            <>
              success in{" "}
              {(searchResult.time / 1000).toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })}{" "}
              seconds
            </>
          ) : (
            status
          )}
        </div>

        <div className="py-1 text-xl">Options:</div>
        <div className="rounded bg-slate-200 p-5"></div>
        <div className="mt-2 flex justify-center">
          <input
            type="button"
            onClick={performRequest}
            value={buttonText}
            className={
              "m-auto mx-auto cursor-pointer rounded bg-red-300 p-3 text-lg disabled:pointer-events-none disabled:bg-gray-200"
            }
            disabled={status === "loading"}
          />
        </div>
        <div className="py-2 text-xl">Results:</div>
        {status === "success" && (
          <div>
            <div className="rounded bg-slate-200 p-2">
              <ResultsTable results={searchResult.results} />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
