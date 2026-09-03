import { PaymentProvider, CreateSubscriptionInput, SubscriptionResult } from './payment.interface';
import crypto from 'crypto';

export class CashfreePaymentProvider implements PaymentProvider {
  private appId: string;
  private secretKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID || '';
    this.secretKey = process.env.CASHFREE_SECRET_KEY || '';
    this.webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || '';
    this.baseUrl =
      process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION'
        ? 'https://api.cashfree.com/pg'
        : 'https://sandbox.cashfree.com/pg';
  }

  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionResult> {
    const response = await fetch(`${this.baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': this.appId,
        'x-client-secret': this.secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        subscription_id: input.subscriptionId,
        plan_id: input.planId,
        customer_details: {
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
        },
        return_url: input.returnUrl,
      }),
    });

    const data = await response.json();
    return {
      subscriptionId: input.subscriptionId,
      status: data.subscription_status || 'PENDING',
      paymentLink: data.auth_link,
      authUrl: data.auth_link,
      raw: data,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': this.appId,
        'x-client-secret': this.secretKey,
        'x-api-version': '2023-08-01',
      },
    });
    return response.ok;
  }

  verifyWebhookSignature(signature: string, rawPayload: string, timestamp: string): boolean {
    if (!this.webhookSecret) return true;
    const computed = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(timestamp + rawPayload)
      .digest('base64');
    return computed === signature;
  }
}