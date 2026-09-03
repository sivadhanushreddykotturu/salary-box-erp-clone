import { PrismaClient } from '@prisma/client';

export interface AuditLogParams {
  companyId?: string | null;
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAuditEvent(db: PrismaClient, params: AuditLogParams) {
  try {
    return await db.auditLog.create({
      data: {
        companyId: params.companyId,
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        metadata: params.metadata || {},
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    // Audit logs should never crash the main transaction unless strictly configured, but log error
    console.error('[AUDIT_LOG_ERROR]', error);
  }
}