import { withTenantContext } from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import { logAuditEvent } from '@/lib/audit';

export interface CreateBranchInput {
  name: string;
  code?: string;
  address?: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
}

export interface CreateShiftInput {
  name: string;
  startTime: string;
  endTime: string;
  graceTimeMinutes?: number;
  halfDayMinutes?: number;
  fullDayMinutes?: number;
  isNightShift?: boolean;
}

export class OrganizationService {
  async getBranches(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.branch.findMany({
        where: { companyId },
        include: { _count: { select: { employees: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async createBranch(companyId: string, input: CreateBranchInput, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const branch = await tx.branch.create({
        data: {
          companyId,
          name: input.name,
          code: input.code,
          address: input.address,
          latitude: input.latitude,
          longitude: input.longitude,
          radiusMeters: input.radiusMeters || 100,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'BRANCH_CREATED',
        resource: 'Branch',
        resourceId: branch.id,
      });

      return branch;
    });
  }

  async updateBranch(
    companyId: string,
    branchId: string,
    input: Partial<CreateBranchInput>,
    userId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const existing = await tx.branch.findFirst({
        where: { id: branchId, companyId },
      });

      if (!existing) {
        throw new NotFoundError('Branch not found');
      }

      const updated = await tx.branch.update({
        where: { id: branchId },
        data: {
          name: input.name ?? existing.name,
          code: input.code !== undefined ? input.code : existing.code,
          address: input.address !== undefined ? input.address : existing.address,
          latitude: input.latitude !== undefined ? input.latitude : existing.latitude,
          longitude: input.longitude !== undefined ? input.longitude : existing.longitude,
          radiusMeters: input.radiusMeters !== undefined ? input.radiusMeters : existing.radiusMeters,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'BRANCH_UPDATED',
        resource: 'Branch',
        resourceId: branchId,
      });

      return updated;
    });
  }

  async deleteBranch(companyId: string, branchId: string, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const existing = await tx.branch.findFirst({
        where: { id: branchId, companyId },
      });

      if (!existing) {
        throw new NotFoundError('Branch not found');
      }

      await tx.branch.delete({
        where: { id: branchId },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'BRANCH_DELETED',
        resource: 'Branch',
        resourceId: branchId,
      });

      return { success: true };
    });
  }

  async getDepartments(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.department.findMany({
        where: { companyId },
        include: { _count: { select: { employees: true } } },
        orderBy: { name: 'asc' },
      });
    });
  }

  async createDepartment(companyId: string, name: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.department.create({
        data: { companyId, name },
      });
    });
  }

  async getDesignations(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.designation.findMany({
        where: { companyId },
        include: { _count: { select: { employees: true } } },
        orderBy: { title: 'asc' },
      });
    });
  }

  async createDesignation(companyId: string, title: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.designation.create({
        data: { companyId, title },
      });
    });
  }

  async getShifts(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.shift.findMany({
        where: { companyId },
        include: { _count: { select: { employees: true } } },
        orderBy: { createdAt: 'asc' },
      });
    });
  }

  async createShift(companyId: string, input: CreateShiftInput) {
    return withTenantContext(companyId, async (tx) => {
      return tx.shift.create({
        data: {
          companyId,
          name: input.name,
          startTime: input.startTime,
          endTime: input.endTime,
          graceTimeMinutes: input.graceTimeMinutes ?? 15,
          halfDayMinutes: input.halfDayMinutes ?? 240,
          fullDayMinutes: input.fullDayMinutes ?? 480,
          isNightShift: input.isNightShift ?? false,
        },
      });
    });
  }
}

export const organizationService = new OrganizationService();