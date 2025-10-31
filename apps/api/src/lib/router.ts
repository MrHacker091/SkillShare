import { adminRouter } from '../routes/admin';
import { authRouter } from '../routes/auth';
import { orderRouter } from '../routes/orders';
import { paymentRouter } from '../routes/payments';
import { productRouter } from '../routes/products';
import { projectRouter } from '../routes/projects';
import { userRouter } from '../routes/users';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
  projects: projectRouter,
  products: productRouter,
  orders: orderRouter,
  payments: paymentRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;