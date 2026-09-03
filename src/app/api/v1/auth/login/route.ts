import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);
    const result = await authService.loginWithEmail(validated);
    return jsonResponse(result, 200, 'Login successful');
  } catch (error) {
    return errorResponse(error);
  }
}