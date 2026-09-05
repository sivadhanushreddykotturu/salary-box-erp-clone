import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { settingsService } from '@/services/settings.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);

    const result = await settingsService.deleteCustomField(companyId, id, authUser.userId);
    return jsonResponse(result, 200, 'Custom field deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
