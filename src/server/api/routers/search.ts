import { TOKEN_ID_LIST, TokenId, Worker } from "diploma-core";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { SearchResultModel } from "../db/dbClient";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import dbConnect from "../db/dbConnect";

export const searchRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  doSearch: publicProcedure
    .input(
      z.object({
        reloadContracts: z.oboolean(),
        blockNumber: z
          .union([z.literal("latest"), z.number().int().positive()])
          .optional(),
        capsSet: z.bigint().array().optional(),
        usedTokens: z
          .enum(TOKEN_ID_LIST as [TokenId, ...TokenId[]])
          .array()
          .optional(),
        saveDataToDb: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const t1 = performance.now();
      const worker = new Worker();
      const result = await worker.doSearch({
        blockNumber: input.blockNumber,
        capsSet: input.capsSet,
        usedTokens: input.usedTokens,
      });
      const t2 = performance.now();

      let results;
      if (!input.saveDataToDb) {
        results = await Promise.all(
          result.map((e) => SearchResultModel.castObject(e))
        );
      } else {
        await dbConnect();
        results = await SearchResultModel.insertMany(result);
      }
      return {
        results,
        time: t2 - t1,
      };
    }),
});

export type SearchRouterInputs = inferRouterInputs<typeof searchRouter>;
export type SearchRouterOutputs = inferRouterOutputs<typeof searchRouter>;
