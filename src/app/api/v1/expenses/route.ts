import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { expenseService } from '@/services/expense.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { ValidationError } from '@/lib/errors';

const claimSchema = z.object({
  category: z.string().min(2),
  amount: z.number().positive(),
  expenseDate: z.string(),
  description: z.string().min(3),
  receiptS3Key: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    if (!user.employeeId) {
      throw new ValidationError('Employee profile required to submit expense claim');
    }

    const body = await req.json();
    const validated = claimSchema.parse(body);
    const claim = await expenseService.submitClaim(companyId, user.employeeId, validated);
    return jsonResponse(claim, 201, 'Expense claim submitted for approval');
  } catch (error) {
    return errorResponse(error);
  }
}