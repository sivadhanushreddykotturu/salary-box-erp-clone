import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { organizationService } from '@/services/organization.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createDeptSchema = z.object({
  name: z.string().min(2),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const depts = await organizationService.getDepartments(companyId);
    return jsonResponse(depts);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { name } = createDeptSchema.parse(body);
    const dept = await organizationService.createDepartment(companyId, name);
    return jsonResponse(dept, 201, 'Department created');
  } catch (error) {
    return errorResponse(error);
  }
}