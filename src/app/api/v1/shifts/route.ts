import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { organizationService } from '@/services/organization.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createShiftSchema = z.object({
  name: z.string().min(2),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  graceTimeMinutes: z.number().optional(),
  halfDayMinutes: z.number().optional(),
  fullDayMinutes: z.number().optional(),
  isNightShift: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const shifts = await organizationService.getShifts(companyId);
    return jsonResponse(shifts);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createShiftSchema.parse(body);
    const shift = await organizationService.createShift(companyId, validated);
    return jsonResponse(shift, 201, 'Shift created');
  } catch (error) {
    return errorResponse(error);
  }
}