import { api } from "~/utils/api";
import { ResultsTable } from "./ResultsTable";
import { ResultsTableLoader, Suberror } from "./ui";

export const BestResultsTable = () => {
  const { data, error, status } = api.search.getBestSearches.useQuery({});
  return (
    <>
      {error && <Suberror>{error.message}</Suberror>}
      {status === "loading" && <ResultsTableLoader />}
      {data && <ResultsTable results={data} />}
    </>
  );
};
