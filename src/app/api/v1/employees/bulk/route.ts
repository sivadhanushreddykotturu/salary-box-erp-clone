import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { employeeService } from '@/services/employee.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();

    const employees = Array.isArray(body.employees) ? body.employees : [body];
    const result = await employeeService.createBulkEmployees(
      companyId,
      employees,
      user.userId
    );

    return jsonResponse(result, 201, `${result.importedCount} employees imported successfully`);
  } catch (error) {
    return errorResponse(error);
  }
}
