import { PrismaClient } from '@prisma/client';

// Ensure a single PrismaClient instance (Node.js hot-reload friendly)
const globalAny = global as any;

export const prisma: PrismaClient = globalAny.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalAny.prisma = prisma;

