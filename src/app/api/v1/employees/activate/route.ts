import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { employeeService } from '@/services/employee.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const activateSchema = z.object({
  employeeIds: z.array(z.string()).min(1, 'At least one employee ID is required'),
});

export async function POST(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = activateSchema.parse(body);

    const result = await employeeService.activateEmployees(
      companyId,
      validated.employeeIds,
      authUser.userId
    );

    return jsonResponse(result, 200, 'Staff activated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
