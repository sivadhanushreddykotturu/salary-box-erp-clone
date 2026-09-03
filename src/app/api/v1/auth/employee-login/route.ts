import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const employeeLoginSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  pin: z.string().min(4, 'PIN must be at least 4 digits'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = employeeLoginSchema.parse(body);
    const result = await authService.loginEmployeeWithPin(validated);
    return jsonResponse(result, 200, 'Employee authenticated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}