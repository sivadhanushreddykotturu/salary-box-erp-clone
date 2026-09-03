import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { attendanceService } from '@/services/attendance.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date') || undefined;
    const branchId = searchParams.get('branchId') || undefined;

    const result = await attendanceService.getLiveAttendance(companyId, dateStr, branchId);
    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}