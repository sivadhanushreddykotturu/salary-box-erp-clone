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
 * Executes queries inside a dedicated transaction with PostgreSQL Row-Level Security (RLS)
 * guaranteed per connection, preventing any pooled connection cross-tenant data leaks.
 */
export async function withTenantContext<T>(
  tenantId: string,
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  if (!tenantId) {
    throw new Error('Tenant context execution requires a valid non-empty tenantId');
  }

  return prisma.$transaction(async (tx) => {
    // Set transaction-scoped RLS variable (fails closed automatically on commit/rollback)
    await tx.$executeRawUnsafe(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
    return fn(tx as unknown as PrismaClient);
  });
}

/**
 * For SuperAdmin or System Webhooks that operate across tenants intentionally
 */
export async function withoutTenantContext<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return fn(tx as unknown as PrismaClient);
  });
}