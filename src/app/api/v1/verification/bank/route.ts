import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { kycService } from '@/services/kyc.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const bankSchema = z.object({
  employeeId: z.string().uuid(),
  accountNumber: z.string().min(6),
  ifsc: z.string().min(11).max(11),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { employeeId, accountNumber, ifsc } = bankSchema.parse(body);

    const result = await kycService.verifyBankAccount(companyId, employeeId, accountNumber, ifsc, user.userId);
    return jsonResponse(result, 200, 'Bank account verified via penny drop');
  } catch (error) {
    return errorResponse(error);
  }
}