import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.search.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>DEX Arbitrageur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {query.data ? query.data.greeting : 'Loading...'}
      </main>
    </>
  );
};

export default Home;
