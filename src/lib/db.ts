/**
 * Prisma Client singleton instance
 * Prevents multiple instances in development due to hot reloading
 */

import { PrismaClient } from '@prisma/client';
import { env } from '@/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with error handling for build-time
let prismaInstance: PrismaClient;

try {
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
} catch (error) {
  // During build or when Prisma client is not properly initialized,
  // create a proxy that will throw meaningful errors only when actually used
  console.warn('Prisma client initialization failed. Using stub for build-time.');
  prismaInstance = new Proxy({} as PrismaClient, {
    get: () => {
      throw new Error('Prisma client is not available. Ensure DATABASE_URL is set and prisma generate has been run.');
    },
  });
}

export const prisma = prismaInstance;
