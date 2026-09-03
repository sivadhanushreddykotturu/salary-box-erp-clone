import { NextRequest } from 'next/server';
import { billingService } from '@/services/billing.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-webhook-signature') || undefined;
    const timestamp = req.headers.get('x-webhook-timestamp') || undefined;
    const body = await req.json();
    const result = await billingService.handleCashfreeWebhook(body, signature, timestamp);
    return jsonResponse(result, 200, 'Cashfree webhook processed');
  } catch (error) {
    return errorResponse(error);
  }
}