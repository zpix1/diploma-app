import { ReactNode } from "react";

export const Block = ({ children }: { children?: ReactNode }) => {
  return <div className="rounded bg-slate-200 p-5">{children}</div>;
};

export const Header = ({ children }: { children?: ReactNode }) => {
  return <div className="py-1 text-xl">{children}</div>;
};
