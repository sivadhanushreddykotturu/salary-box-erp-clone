import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { kycService } from '@/services/kyc.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const panSchema = z.object({
  employeeId: z.string().uuid(),
  panNumber: z.string().min(10).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { employeeId, panNumber } = panSchema.parse(body);

    const result = await kycService.verifyPan(companyId, employeeId, panNumber, user.userId);
    return jsonResponse(result, 200, 'PAN verified via NSDL');
  } catch (error) {
    return errorResponse(error);
  }
}