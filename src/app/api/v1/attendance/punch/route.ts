import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { attendanceService } from '@/services/attendance.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { PunchType } from '@prisma/client';
import { ValidationError } from '@/lib/errors';

const punchSchema = z.object({
  punchType: z.nativeEnum(PunchType),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  deviceInfo: z.string().optional(),
  mockGpsDetected: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);

    if (!user.employeeId) {
      throw new ValidationError('User does not have an active employee profile to record attendance');
    }

    const body = await req.json();
    const validated = punchSchema.parse(body);

    const ipAddress = req.headers.get('x-forwarded-for') || undefined;

    const result = await attendanceService.recordPunch(companyId, user.employeeId, {
      ...validated,
      ipAddress,
    });

    return jsonResponse(result, 200, `Punch ${validated.punchType} recorded successfully`);
  } catch (error) {
    return errorResponse(error);
  }
}