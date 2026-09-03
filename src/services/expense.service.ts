import { withTenantContext } from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ClaimStatus, AdvanceStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

export interface CreateClaimInput {
  category: string;
  amount: number;
  expenseDate: string;
  description: string;
  receiptS3Key?: string;
}

export interface CreateAdvanceInput {
  totalAmount: number;
  tenureMonths: number;
  reason: string;
}

export class ExpenseService {
  async submitClaim(companyId: string, employeeId: string, input: CreateClaimInput) {
    return withTenantContext(companyId, async (tx) => {
      const claim = await tx.reimbursementClaim.create({
        data: {
          companyId,
          employeeId,
          category: input.category,
          amount: input.amount,
          expenseDate: new Date(input.expenseDate),
          description: input.description,
          receiptS3Key: input.receiptS3Key,
          status: ClaimStatus.PENDING,
        },
      });

      return claim;
    });
  }

  async reviewClaim(
    companyId: string,
    claimId: string,
    status: 'APPROVED' | 'REJECTED',
    payrollMonth?: number,
    payrollYear?: number,
    reviewerUserId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const claim = await tx.reimbursementClaim.findUnique({ where: { id: claimId } });
      if (!claim || claim.companyId !== companyId) {
        throw new NotFoundError('Claim not found');
      }

      const updated = await tx.reimbursementClaim.update({
        where: { id: claimId },
        data: {
          status,
          approvedById: reviewerUserId,
          payrollMonth,
          payrollYear,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId: reviewerUserId,
        action: `EXPENSE_CLAIM_${status}`,
        resource: 'ReimbursementClaim',
        resourceId: claimId,
      });

      return updated;
    });
  }

  async requestSalaryAdvance(companyId: string, employeeId: string, input: CreateAdvanceInput) {
    const monthlyEmi = Math.round(input.totalAmount / input.tenureMonths);

    return withTenantContext(companyId, async (tx) => {
      const advance = await tx.salaryAdvance.create({
        data: {
          companyId,
          employeeId,
          totalAmount: input.totalAmount,
          monthlyEmi,
          tenureMonths: input.tenureMonths,
          remainingAmount: input.totalAmount,
          reason: input.reason,
          status: AdvanceStatus.PENDING,
        },
      });

      return advance;
    });
  }
}

export const expenseService = new ExpenseService();