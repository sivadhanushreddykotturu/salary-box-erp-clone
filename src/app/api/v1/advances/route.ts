import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { expenseService } from '@/services/expense.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { ValidationError } from '@/lib/errors';

const advanceSchema = z.object({
  totalAmount: z.number().positive(),
  tenureMonths: z.number().min(1).max(24),
  reason: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    if (!user.employeeId) {
      throw new ValidationError('Employee profile required to request salary advance');
    }

    const body = await req.json();
    const validated = advanceSchema.parse(body);
    const advance = await expenseService.requestSalaryAdvance(companyId, user.employeeId, validated);
    return jsonResponse(advance, 201, 'Salary advance requested');
  } catch (error) {
    return errorResponse(error);
  }
}