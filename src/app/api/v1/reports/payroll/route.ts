import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { reportService } from '@/services/report.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1), 10);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()), 10);

    const report = await reportService.getPayrollRegisterReport(companyId, month, year);
    return jsonResponse(report);
  } catch (error) {
    return errorResponse(error);
  }
}