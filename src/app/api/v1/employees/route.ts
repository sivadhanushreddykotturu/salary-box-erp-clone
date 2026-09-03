import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { employeeService } from '@/services/employee.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createEmployeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  email: z.string().email().optional(),
  pin: z.string().min(4).max(6).optional(),
  dateOfJoining: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  shiftId: z.string().optional(),
  reportingManagerId: z.string().optional(),
  salaryStructureId: z.string().optional(),
  gender: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId') || undefined;
    const departmentId = searchParams.get('departmentId') || undefined;
    const search = searchParams.get('search') || undefined;

    const employees = await employeeService.getEmployees(companyId, { branchId, departmentId, search });
    return jsonResponse(employees);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createEmployeeSchema.parse(body);
    const employee = await employeeService.createEmployee(companyId, validated, user.userId);
    return jsonResponse(employee, 201, 'Employee onboarded successfully');
  } catch (error) {
    return errorResponse(error);
  }
}