import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext, requireRoles } from '@/middleware/auth.middleware';
import { payrollService } from '@/services/payroll.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { Role } from '@prisma/client';

const runPayrollSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    requireRoles(user, [Role.COMPANY_OWNER, Role.HR_ADMIN]);
    const companyId = requireTenantContext(user);

    const body = await req.json();
    const { month, year } = runPayrollSchema.parse(body);
    const run = await payrollService.runMonthlyPayroll(companyId, month, year, user.userId);
    return jsonResponse(run, 200, `Payroll calculated for ${month}/${year}`);
  } catch (error) {
    return errorResponse(error);
  }
}