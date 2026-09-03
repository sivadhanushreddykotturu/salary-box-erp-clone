import { NextRequest } from 'next/server';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { leaveService } from '@/services/leave.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const types = await leaveService.getLeaveTypes(companyId);
    return jsonResponse(types);
  } catch (error) {
    return errorResponse(error);
  }
}