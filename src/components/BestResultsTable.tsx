import { api } from "~/utils/api";
import { ResultsTable } from "./ResultsTable";
import { ResultsTableLoader } from "./ui";

export const BestResultsTable = () => {
  const { data, error } = api.search.getBestSearches.useQuery({});
  return (
    <>
      {error && error.message}
      {!data && <ResultsTableLoader />}
      {data && <ResultsTable results={data} />}
    </>
  );
};
