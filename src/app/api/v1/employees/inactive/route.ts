import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { employeeService } from '@/services/employee.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const { searchParams } = new URL(req.url);

    const branchId = searchParams.get('branchId') || undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const search = searchParams.get('search') || undefined;

    const inactiveList = await employeeService.getInactiveEmployees(companyId, {
      branchId,
      departmentId,
      startDate,
      endDate,
      search,
    });

    return jsonResponse(inactiveList, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
