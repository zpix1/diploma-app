import type { SearchRouterOutputs } from "~/server/api/routers/search";

export const TradeStrategy = ({
  strategy,
}: {
  strategy: SearchRouterOutputs["doSearch"]["results"][number]["strategy"];
}) => {
  const start = strategy[0];
  const end = strategy[strategy.length - 1];
  return (
    <div className="flex flex-col justify-between gap-5 ">
      <div className="rounded bg-slate-500 p-5 text-white">
        You start with {start?.fromValue?.valueInDecimals} {start?.from}
      </div>
      {strategy.map((s, i) => (
        <div className="rounded bg-slate-500 p-5 text-white">
          <div>
            You trade {s.from} to {s.to} on {s.exchange}
          </div>
        </div>
      ))}
      <div className="rounded bg-slate-500 p-5 text-white">
        You end with {end?.toValue?.valueInDecimals} {end?.to}
      </div>
    </div>
  );
};
