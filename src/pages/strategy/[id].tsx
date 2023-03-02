import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Base } from "~/components/Base";
import { ResultsTable } from "~/components/ResultsTable";
import { TradeStrategy } from "~/components/TradeStrategy";
import { Block, Header } from "~/components/ui";
import { api } from "~/utils/api";

const Strategy: NextPage = () => {
  const router = useRouter();
  const id = router.query.id?.toString() ?? "";

  const { data, error } = api.search.getSearchResult.useQuery({
    id,
  });

  return (
    <Base>
      {error && <div>Error: {error.message}</div>}
      {!data && "Loading..."}
      {data && (
        <>
          <Header>Search result info:</Header>
          <Block>
            <ResultsTable results={[data]} addStrategyLink={false} />
          </Block>
          <Header>Trade order:</Header>
          <Block>
            <TradeStrategy strategy={data.strategy} />
          </Block>
        </>
      )}
    </Base>
  );
};

export default Strategy;
