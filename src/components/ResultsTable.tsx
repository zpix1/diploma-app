import Link from "next/link";
import type { SearchRouterOutputs } from "~/server/api/routers/search";

const rateFormatter = Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "numeric",
});

export const ResultsTable = ({
  results,
  addStrategyLink,
}: {
  results: SearchRouterOutputs["doSearch"]["results"];
  addStrategyLink?: boolean;
}) => {
  addStrategyLink ??= true;

  return (
    <table className="w-full whitespace-nowrap text-left">
      <tr>
        <th className="p-1">Found At</th>
        <th className="p-1">Block Number</th>
        <th className="p-1">Status</th>
        <th className="p-1">Capital in USD</th>
        <th className="p-1">Start Token</th>
        <th className="p-1">Start Value</th>
        <th className="p-1">End Value</th>
        <th className="p-1">Calculated Rate</th>
        <th className="p-1">Real Rate</th>
        <th className="p-1">Profit in USD</th>
        {addStrategyLink && <th className="p-1">Strategy</th>}
      </tr>
      {results.map((result) => (
        <tr>
          <td className="px-1">
            {dateFormatter.format(new Date(result.createdAt))}
          </td>
          <td className="px-1">{result.startBlock}</td>
          <td className="px-1">{result.status}</td>
          <td className="px-1">{result.capitalInUSD}</td>
          <td className="px-1">{result.startToken}</td>
          <td className="px-1">{result.startValue}</td>
          <td className="px-1">{result.endValue}</td>
          <td className="px-1">
            {result.rate !== undefined && rateFormatter.format(result.rate)}
          </td>
          <td className="px-1">
            {result.realRate !== undefined &&
              rateFormatter.format(result.realRate)}
          </td>
          <td className="px-1">{result.profitInUSD}</td>
          {addStrategyLink && (
            <td className="px-1">
              {result.status === "FOUND" && (
                <Link href={`/strategy/${result._id}`} className="underline">
                  {result.strategy.length} steps
                </Link>
              )}
            </td>
          )}
        </tr>
      ))}
    </table>
  );
};
