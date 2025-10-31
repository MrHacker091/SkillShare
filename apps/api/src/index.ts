import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import 'dotenv/config';
import Fastify from 'fastify';
import { createContext } from './lib/context';
import { appRouter } from './lib/router';

const fastify = Fastify({
  maxParamLength: 5000,
  logger: true,
});

const start = async () => {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: (origin, cb) => {
        const hostname = new URL(origin || 'http://localhost:3000').hostname;
        if (hostname === 'localhost') {
          cb(null, true);
          return;
        }

        // Allow production domains
        if (hostname === 'skillshare.vercel.app' || hostname === 'skillshare.com') {
          cb(null, true);
          return;
        }

        cb(new Error("Not allowed"), false);
      },
      credentials: true,
    });

    // Register tRPC
    await fastify.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: { router: appRouter, createContext },
    });

    // Health check endpoint
    fastify.get('/health', async () => {
      return { status: 'OK', timestamp: new Date().toISOString() };
    });

    const port = Number(process.env.PORT) || 3001;
    const host = process.env.HOST || 'localhost';

    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📚 tRPC API available at http://${host}:${port}/trpc`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();