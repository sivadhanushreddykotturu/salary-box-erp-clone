import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { crmService } from '@/services/crm.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createCustSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  gstin: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const customers = await crmService.getCustomers(companyId);
    return jsonResponse(customers);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createCustSchema.parse(body);
    const cust = await crmService.createCustomer(companyId, validated);
    return jsonResponse(cust, 201, 'Customer created');
  } catch (error) {
    return errorResponse(error);
  }
}