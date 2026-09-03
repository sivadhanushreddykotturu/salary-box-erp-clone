import { NextRequest } from 'next/server';
import { z } from 'zod';
import { authService } from '@/services/auth.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const superAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = superAdminSchema.parse(body);
    const result = await authService.loginSuperAdmin(validated.email, validated.password);
    return jsonResponse(result, 200, 'Super Admin logged in');
  } catch (error) {
    return errorResponse(error);
  }
}