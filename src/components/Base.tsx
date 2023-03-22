import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

export const Base = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>DEX Arbitrageur</title>
      </Head>
      <div className="center pt-5 text-center text-2xl">
        <Link href="/">DEX Arbitrageur</Link>
      </div>
      <main className="m-auto mt-5 max-w-6xl rounded bg-slate-300 p-5">
        {children}
      </main>
    </>
  );
};
