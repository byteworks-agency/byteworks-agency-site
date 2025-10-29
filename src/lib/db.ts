// Support both CJS and ESM environments in serverless/SSR
// Avoid named import to prevent "Named export not found" in some runtimes
import pkg from '@prisma/client';
const { PrismaClient } = pkg as typeof import('@prisma/client');

// Ensure a single PrismaClient instance (Node.js hot-reload friendly)
const globalAny = global as any;

export const prisma: PrismaClient = globalAny.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalAny.prisma = prisma;
