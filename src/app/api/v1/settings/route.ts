import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { settingsService } from '@/services/settings.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const data = await settingsService.getSettings(companyId);
    return jsonResponse(data, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const result = await settingsService.updateSettings(
      companyId,
      body,
      authUser.userId
    );
    return jsonResponse(result, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}
