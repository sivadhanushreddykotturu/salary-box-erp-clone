import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { adminService } from '@/services/admin.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const admins = await adminService.getAdmins(companyId);
    return jsonResponse(admins, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = createAdminSchema.parse(body);

    const result = await adminService.createAdmin(
      companyId,
      {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || undefined,
      },
      authUser.userId
    );

    return jsonResponse(result, 201, 'Admin added successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
