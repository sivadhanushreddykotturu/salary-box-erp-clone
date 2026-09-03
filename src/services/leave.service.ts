import { withTenantContext } from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { LeaveStatus, HalfDayType } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

export interface ApplyLeaveInput {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  halfDayType?: HalfDayType;
  reason: string;
}

export class LeaveService {
  async getLeaveTypes(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      return tx.leaveType.findMany({
        where: { companyId },
        orderBy: { name: 'asc' },
      });
    });
  }

  async getEmployeeBalances(companyId: string, employeeId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();
    return withTenantContext(companyId, async (tx) => {
      return tx.leaveBalance.findMany({
        where: {
          employeeId,
          year: targetYear,
        },
        include: { leaveType: true },
      });
    });
  }

  async applyLeave(companyId: string, employeeId: string, input: ApplyLeaveInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (end < start) {
      throw new ValidationError('End date cannot be earlier than start date');
    }

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = input.halfDayType && input.halfDayType !== HalfDayType.NONE ? 0.5 : diffDays;

    return withTenantContext(companyId, async (tx) => {
      const balance = await tx.leaveBalance.findFirst({
        where: {
          employeeId,
          leaveTypeId: input.leaveTypeId,
          year: start.getFullYear(),
        },
      });

      if (!balance) {
        throw new ValidationError('No leave quota allocated for this leave type');
      }

      const available = balance.totalDays - balance.usedDays - balance.pendingDays;
      if (available < totalDays) {
        throw new ValidationError(
          `Insufficient leave balance. Requested ${totalDays} days, but only ${available} days available.`
        );
      }

      // Update pending balance
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: { pendingDays: balance.pendingDays + totalDays },
      });

      const request = await tx.leaveRequest.create({
        data: {
          employeeId,
          leaveTypeId: input.leaveTypeId,
          startDate: start,
          endDate: end,
          totalDays,
          halfDayType: input.halfDayType || HalfDayType.NONE,
          reason: input.reason,
          status: LeaveStatus.PENDING,
        },
        include: { leaveType: true },
      });

      return request;
    });
  }

  async reviewLeave(
    companyId: string,
    leaveRequestId: string,
    status: 'APPROVED' | 'REJECTED',
    reviewerUserId: string,
    rejectionReason?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const leave = await tx.leaveRequest.findUnique({
        where: { id: leaveRequestId },
        include: { employee: true },
      });

      if (!leave || leave.employee.companyId !== companyId) {
        throw new NotFoundError('Leave request not found');
      }

      if (leave.status !== LeaveStatus.PENDING) {
        throw new ValidationError(`Leave request is already ${leave.status}`);
      }

      const balance = await tx.leaveBalance.findFirst({
        where: {
          employeeId: leave.employeeId,
          leaveTypeId: leave.leaveTypeId,
          year: leave.startDate.getFullYear(),
        },
      });

      if (balance) {
        if (status === LeaveStatus.APPROVED) {
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
              pendingDays: Math.max(0, balance.pendingDays - leave.totalDays),
              usedDays: balance.usedDays + leave.totalDays,
            },
          });
        } else {
          await tx.leaveBalance.update({
            where: { id: balance.id },
            data: {
              pendingDays: Math.max(0, balance.pendingDays - leave.totalDays),
            },
          });
        }
      }

      const updated = await tx.leaveRequest.update({
        where: { id: leaveRequestId },
        data: {
          status,
          approvedById: reviewerUserId,
          rejectionReason,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId: reviewerUserId,
        action: `LEAVE_${status}`,
        resource: 'LeaveRequest',
        resourceId: leaveRequestId,
        metadata: { employeeId: leave.employeeId, days: leave.totalDays },
      });

      return updated;
    });
  }
}

export const leaveService = new LeaveService();