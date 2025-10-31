import { z } from 'zod';
import { protectedProcedure, router } from '../lib/trpc';

export const paymentRouter = router({
  createPaymentIntent: protectedProcedure
    .input(z.object({
      amount: z.number(),
      currency: z.string().default('USD'),
    }))
    .mutation(async ({ ctx, input }) => {
      return { clientSecret: 'mock_secret' };
    }),

  getWalletBalance: protectedProcedure
    .query(async ({ ctx }) => {
      return { balance: 0, currency: 'USD' };
    }),
});