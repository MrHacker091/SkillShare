import { z } from 'zod';
import { creatorProcedure, publicProcedure, router } from '../lib/trpc';

export const productRouter = router({
  getAll: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().min(1).max(50).default(12),
    }))
    .query(async ({ ctx, input }) => {
      return {
        products: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return null;
    }),

  create: creatorProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      price: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return null;
    }),
});