import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { organizationService } from '@/services/organization.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createBranchSchema = z.object({
  name: z.string().min(2),
  code: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radiusMeters: z.number().default(100),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const branches = await organizationService.getBranches(companyId);
    return jsonResponse(branches);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createBranchSchema.parse(body);
    const branch = await organizationService.createBranch(companyId, validated, user.userId);
    return jsonResponse(branch, 201, 'Branch created successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return errorResponse(new Error('Branch ID is required'));
    }
    const branch = await organizationService.updateBranch(companyId, id, data, user.userId);
    return jsonResponse(branch, 200, 'Branch updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return errorResponse(new Error('Branch ID is required'));
    }
    const result = await organizationService.deleteBranch(companyId, id, user.userId);
    return jsonResponse(result, 200, 'Branch deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}