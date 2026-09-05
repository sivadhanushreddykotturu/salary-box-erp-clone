import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { adminService } from '@/services/admin.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const updateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = updateAdminSchema.parse(body);

    const result = await adminService.updateAdmin(
      companyId,
      id,
      {
        name: validated.name,
        phone: validated.phone,
        email: validated.email,
      },
      authUser.userId
    );

    return jsonResponse(result, 200, 'Admin updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);

    const result = await adminService.deleteAdmin(companyId, id, authUser.userId);
    return jsonResponse(result, 200, 'Admin removed successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
