import { z } from 'zod';
import { protectedProcedure, router } from '../lib/trpc';

export const orderRouter = router({
  create: protectedProcedure
    .input(z.object({
      productIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      return null;
    }),

  getMyOrders: protectedProcedure
    .query(async ({ ctx }) => {
      return [];
    }),
});