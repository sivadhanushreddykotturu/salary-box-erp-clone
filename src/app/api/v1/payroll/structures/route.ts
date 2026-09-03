import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext, requireRoles } from '@/middleware/auth.middleware';
import { payrollService } from '@/services/payroll.service';
import { jsonResponse, errorResponse } from '@/lib/response';
import { Role } from '@prisma/client';

const createStructureSchema = z.object({
  title: z.string().min(2),
  monthlyCtc: z.number().positive(),
  basicSalary: z.number().positive(),
  hra: z.number().nonnegative(),
  specialAllowance: z.number().optional(),
  conveyance: z.number().optional(),
  medicalAllowance: z.number().optional(),
  providentFundEmployee: z.number().optional(),
  esiEmployee: z.number().optional(),
  professionalTax: z.number().optional(),
  tdsMonthly: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    requireRoles(user, [Role.COMPANY_OWNER, Role.HR_ADMIN]);
    const companyId = requireTenantContext(user);

    const body = await req.json();
    const validated = createStructureSchema.parse(body);
    const structure = await payrollService.createStructure(companyId, validated);
    return jsonResponse(structure, 201, 'Salary structure created');
  } catch (error) {
    return errorResponse(error);
  }
}