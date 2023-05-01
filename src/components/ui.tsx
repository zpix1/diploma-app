import { ReactNode } from "react";

export const Block = ({ children }: { children?: ReactNode }) => {
  return <div className="rounded bg-slate-200 p-5">{children}</div>;
};

export const Header = ({ children }: { children?: ReactNode }) => {
  return <div className="pt-2 pb-1 text-xl">{children}</div>;
};

export const Subtext = ({ children }: { children?: ReactNode }) => {
  return <span className="align-middle text-sm">{children}</span>;
};

export const Suberror = ({ children }: { children?: ReactNode }) => {
  return (
    <span className="align-middle text-sm lowercase text-red-500">
      {children}
    </span>
  );
};

export const ResultsTableLoader = () => {
  return (
    <div className="flex animate-pulse space-x-4">
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 rounded bg-sky-700"></div>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`${i}`} className="grid grid-cols-12 gap-4">
              <div className="col-span-2 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
              <div className="col-span-1 h-2 rounded bg-sky-700"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
