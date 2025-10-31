import { z } from 'zod';
import { adminProcedure, router } from '../lib/trpc';

export const adminRouter = router({
  getStats: adminProcedure
    .query(async ({ ctx }) => {
      return {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
      };
    }),

  getUsers: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      return {
        users: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    }),
});