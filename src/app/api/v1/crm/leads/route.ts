import { NextRequest } from 'next/server';
import { z } from 'zod';
import { extractAuthUser, requireTenantContext } from '@/middleware/auth.middleware';
import { crmService } from '@/services/crm.service';
import { jsonResponse, errorResponse } from '@/lib/response';

const createLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  leadValue: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const leads = await crmService.getLeads(companyId);
    return jsonResponse(leads);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = extractAuthUser(req);
    const companyId = requireTenantContext(user);
    const body = await req.json();
    const validated = createLeadSchema.parse(body);
    const lead = await crmService.createLead(companyId, validated);
    return jsonResponse(lead, 201, 'Lead created');
  } catch (error) {
    return errorResponse(error);
  }
}