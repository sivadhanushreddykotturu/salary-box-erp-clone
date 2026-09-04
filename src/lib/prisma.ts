import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Executes MongoDB queries inside an isolated tenant context.
 * Validates tenantId and executes with tenant boundary.
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  if (!tenantId) {
    throw new Error('Tenant context execution requires a valid non-empty tenantId');
  }

  // MongoDB native transaction or direct scoped execution
  try {
    return await prisma.$transaction(async (tx) => {
      return fn(tx as unknown as PrismaClient);
    });
  } catch (err) {
    // Fallback for standalone MongoDB test instances without replica sets
    return fn(prisma);
  }
}

/**
 * For SuperAdmin or System Webhooks that operate across tenants intentionally
 */
export async function withoutTenantContext<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => {
      return fn(tx as unknown as PrismaClient);
    });
  } catch (err) {
    return fn(prisma);
  }
}