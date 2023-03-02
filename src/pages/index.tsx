import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Base } from "~/components/Base";
import { BestResultsTable } from "~/components/BestResultsTable";
import { ResultsTable } from "~/components/ResultsTable";
import { Block, Header } from "~/components/ui";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const {
    data: searchResult,
    status,
    error,
    mutate,
  } = api.search.doSearch.useMutation();

  const performSearchRequest = () => mutate({});

  const buttonText =
    status === "loading"
      ? "Loading..."
      : status === "success"
      ? "Do Search Again"
      : "Do Search";

  return (
    <Base>
      <Header>Status: </Header>
      <Block>
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
      </Block>

      <Header>Options:</Header>
      <Block></Block>
      <div className="mt-2 flex justify-center">
        <input
          type="button"
          onClick={performSearchRequest}
          value={buttonText}
          className={
            "m-auto mx-auto cursor-pointer rounded bg-red-300 p-3 text-lg disabled:pointer-events-none disabled:bg-gray-200"
          }
          disabled={status === "loading"}
        />
      </div>
      {status === "success" && (
        <>
          <Header>Results:</Header>
          <Block>
            <ResultsTable results={searchResult.results} />
          </Block>
        </>
      )}
      <Header>Top 10 results:</Header>
      <Block>
        <BestResultsTable />
      </Block>
    </Base>
  );
};

export default Home;
