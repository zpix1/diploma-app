import { api } from "~/utils/api";
import { ResultsTable } from "./ResultsTable";

export const BestResultsTable = () => {
  const { data, error } = api.search.getBestSearches.useQuery({});
  return (
    <>
      {error && error.message}
      {!data && "Loading..."}
      {data && <ResultsTable results={data} />}
    </>
  );
};
