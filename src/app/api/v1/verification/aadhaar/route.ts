import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { kycService } from '@/services/kyc.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const aadhaarSchema = z.object({
  employeeId: z.string().uuid(),
  aadhaarNumber: z.string().min(12).max(14),
  otp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { employeeId, aadhaarNumber, otp } = aadhaarSchema.parse(body);

    const result = await kycService.verifyAadhaar(companyId, employeeId, aadhaarNumber, otp, user.userId);
    return jsonResponse(result, 200, 'Aadhaar processed with Decentro');
  } catch (error) {
    return errorResponse(error);
  }
}