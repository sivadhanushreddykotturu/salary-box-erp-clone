import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  businessEmail: z.string().email('Valid business email is required'),
  phone: z.string().optional(),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  planCode: z.string().optional(),
  gstin: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);
    const result = await authService.registerCompany(validated);
    return jsonResponse(result, 201, 'Company registered successfully with 14-day trial');
  } catch (error) {
    return errorResponse(error);
  }
}