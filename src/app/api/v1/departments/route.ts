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

export async function PATCH(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { id, name, action, employeeId } = body;

    if (!id) {
      return errorResponse(new Error('Department ID is required'));
    }

    if (action === 'ASSIGN_EMPLOYEE' && employeeId) {
      const result = await organizationService.assignEmployeeToDepartment(companyId, id, employeeId);
      return jsonResponse(result, 200, 'Employee assigned to department');
    }

    if (action === 'REMOVE_EMPLOYEE' && employeeId) {
      const result = await organizationService.removeEmployeeFromDepartment(companyId, employeeId);
      return jsonResponse(result, 200, 'Employee removed from department');
    }

    if (name) {
      const dept = await organizationService.updateDepartment(companyId, id, name);
      return jsonResponse(dept, 200, 'Department updated');
    }

    return errorResponse(new Error('Invalid update request'));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse(new Error('Department ID is required'));
    }

    const result = await organizationService.deleteDepartment(companyId, id);
    return jsonResponse(result, 200, 'Department deleted');
  } catch (error) {
    return errorResponse(error);
  }
}