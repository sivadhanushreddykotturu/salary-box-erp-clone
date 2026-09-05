import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { employeeService } from '@/services/employee.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const updateRoleSchema = z.object({
  userRole: z.enum([
    'Employee',
    'Branch Admin',
    'Attendance Manager',
    'Custom',
    'Advanced Attendance Manager',
    'Admin',
    'Company Owner',
  ]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = updateRoleSchema.parse(body);

    const result = await employeeService.updateEmployeeRole(
      companyId,
      id,
      validated.userRole,
      authUser.userId
    );

    return jsonResponse(result, 200, 'Employee role updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
