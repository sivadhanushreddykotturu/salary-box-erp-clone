import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { leaveService } from '@/services/leave.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { HalfDayType } from '@prisma/client';
import { ValidationError } from '@/lib/errors';

const applyLeaveSchema = z.object({
  leaveTypeId: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  halfDayType: z.nativeEnum(HalfDayType).optional(),
  reason: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    if (!user.employeeId) {
      throw new ValidationError('Employee profile required to apply for leave');
    }

    const body = await req.json();
    const validated = applyLeaveSchema.parse(body);
    const result = await leaveService.applyLeave(companyId, user.employeeId, validated);
    return jsonResponse(result, 201, 'Leave application submitted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}