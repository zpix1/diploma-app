import {
  DEFAULT_CAPS_SET,
  FACTORIES,
  TOKENS,
  TOKEN_ID_LIST,
  TokenId,
  Worker,
} from "diploma-core";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { SearchResultModel } from "../db/dbClient";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import dbConnect from "../db/dbConnect";
import { env } from "~/env.mjs";

const ConfigScheme = z.object({
  reloadContracts: z.oboolean(),
  blockNumber: z
    .union([z.literal("latest"), z.number().int().positive()])
    .optional(),
  capsSet: z.bigint().array().optional(),
  usedTokens: z
    .enum(TOKEN_ID_LIST as [TokenId, ...TokenId[]])
    .array()
    .optional(),
  usedFactories: z.enum(FACTORIES).array().optional(),
});

export const searchRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  doSearch: publicProcedure.input(ConfigScheme).mutation(async ({ input }) => {
    const t1 = performance.now();
    const worker = new Worker({
      web3ProviderUrl: env.WEB3_PROVIDER_URL,
      maxTPS: input.blockNumber === "latest" ? Infinity : 30,
    });
    const result = await worker.doSearch({
      blockNumber: input.blockNumber,
      capsSet: input.capsSet,
      usedTokens: input.usedTokens,
      usedFactories: input.usedFactories,
    });
    const t2 = performance.now();

    await dbConnect();
    const results = await SearchResultModel.insertMany(result);
    return {
      results,
      time: t2 - t1,
    };
  }),
  getSearchResult: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      await dbConnect();
      return SearchResultModel.findById(input.id);
    }),
  getBestSearches: publicProcedure.input(z.object({})).query(async () => {
    await dbConnect();
    return SearchResultModel.find({}).sort({ _profitInUSD: -1 }).limit(10);
  }),
  getConfig: publicProcedure.input(z.object({})).query(() => ({
    availableTokens: TOKENS,
    availableFactories: FACTORIES,
    capsSet: DEFAULT_CAPS_SET,
  })),
});

export type SearchRouterInputs = inferRouterInputs<typeof searchRouter>;
export type SearchRouterOutputs = inferRouterOutputs<typeof searchRouter>;
