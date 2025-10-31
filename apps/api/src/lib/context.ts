import { prisma } from '@skillshare/database';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import jwt from 'jsonwebtoken';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // Get user from JWT token
  async function getUserFromHeader() {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          creatorProfile: true,
          accounts: true,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  const user = await getUserFromHeader();

  return {
    req,
    res,
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;