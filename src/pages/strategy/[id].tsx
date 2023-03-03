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
          <Header>Config:</Header>
          <Block>
            <div>Contracts count: {data.config?.contractsCount}</div>
            <div>Used factories: {data.config?.usedFactories.join(", ")}</div>
            <div>Used tokens: {data.config?.usedTokens.join(", ")}</div>
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
