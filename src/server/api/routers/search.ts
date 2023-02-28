import { TOKEN_ID_LIST, TokenId, Worker } from "diploma-core";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    .query(async ({ input }) => {
      const worker = new Worker();
      return await worker.doSearch({
        blockNumber: input.blockNumber,
        capsSet: input.capsSet,
        usedTokens: input.usedTokens,
      });
    }),
});
