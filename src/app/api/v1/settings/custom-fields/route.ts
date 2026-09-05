import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { settingsService } from '@/services/settings.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const fields = await settingsService.getCustomFields(companyId);
    return jsonResponse(fields, 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const companyId = requireTenantContext(authUser);
    const body = await req.json();
    const validated = createFieldSchema.parse(body);

    const result = await settingsService.addCustomField(
      companyId,
      validated.name,
      authUser.userId
    );

    return jsonResponse(result, 201, 'Custom field created successfully');
  } catch (error) {
    return errorResponse(error);
  }
}
