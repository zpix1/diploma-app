import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Base } from "~/components/Base";
import { BestResultsTable } from "~/components/BestResultsTable";
import { Configurator } from "~/components/Configurator";
import { ResultsTable } from "~/components/ResultsTable";
import { Block, Header, ResultsTableLoader } from "~/components/ui";
import { SearchRouterInputs } from "~/server/api/routers/search";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const {
    data: searchResult,
    status,
    error,
    mutate,
  } = api.search.doSearch.useMutation();

  const performSearchRequest = () =>
    mutate({
      ...config,
    });

  const [config, setConfig] = useState<SearchRouterInputs["doSearch"]>();

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
        {status === "success" && (
          <>
            Success in{" "}
            {(searchResult.time / 1000).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}{" "}
            seconds
          </>
        )}
        {status === "error" && <>Error: {error.message}</>}
        {status === "idle" && <>...</>}
        {status === "loading" && <>Loading...</>}
      </Block>

      <Header>Options:</Header>
      <Block>
        <Configurator setConfig={setConfig} disabled={status === "loading"} />
      </Block>
      <div className="mt-2 flex justify-center">
        <input
          type="button"
          onClick={performSearchRequest}
          value={`${buttonText}`}
          className={
            "m-auto mx-auto cursor-pointer rounded  bg-sky-500 p-3 text-lg text-white disabled:pointer-events-none disabled:bg-gray-200 disabled:text-black"
          }
          disabled={status === "loading"}
        />
      </div>
      {(status === "success" || status === "loading") && (
        <>
          <Header>Results:</Header>
          <Block>
            {status === "success" && (
              <ResultsTable results={searchResult.results} />
            )}
            {status === "loading" && <ResultsTableLoader />}
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
