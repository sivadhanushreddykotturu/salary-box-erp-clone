import { NextRequest } from 'next/server';
import { kycService } from '@/services/kyc.service';
import { jsonResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-decentro-signature') || undefined;
    const body = await req.json();
    const result = await kycService.handleDecentroWebhook(body, signature);
    return jsonResponse(result, 200, 'Webhook processed');
  } catch (error) {
    return errorResponse(error);
  }
}