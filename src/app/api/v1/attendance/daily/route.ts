import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { attendanceService } from '@/services/attendance.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { ValidationError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);

    const employeeId = searchParams.get('employeeId') || user.employeeId;
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }

    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1), 10);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);

    const logs = await attendanceService.getDailyLogs(companyId, employeeId, month, year);
    return jsonResponse(logs);
  } catch (error) {
    return errorResponse(error);
  }
}