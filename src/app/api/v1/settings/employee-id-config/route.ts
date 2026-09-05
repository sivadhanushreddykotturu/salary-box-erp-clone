import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { settingsService } from '@/services/settings.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const updateEmployeeIdConfigSchema = z.object({
  autoAssign: z.boolean(),
  prefix: z.string().optional(),
  nextNumber: z.number().int().min(1).optional(),
  digitsInNumber: z.number().int().min(0).max(10, 'Digits in number must be less than or equal to 10').optional(),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const config = await settingsService.getEmployeeIdConfig(companyId);
    return jsonResponse(config, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = updateEmployeeIdConfigSchema.parse(body);

    const result = await settingsService.updateEmployeeIdConfig(
      companyId,
      validated,
      authUser.userId
    );

    return jsonResponse(result, 200, 'Employee ID configuration saved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  return PUT(req);
}
