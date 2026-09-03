export interface CreateSubscriptionPlanInput {
  planId: string;
  planName: string;
  amount: number;
  intervalType: 'MONTH' | 'YEAR';
  intervals: number;
  description?: string;
}

export interface CreateSubscriptionInput {
  subscriptionId: string;
  planId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl?: string;
}

export interface SubscriptionResult {
  subscriptionId: string;
  status: 'INITIALIZED' | 'ACTIVE' | 'PENDING' | 'FAILED';
  paymentLink?: string;
  authUrl?: string;
  raw?: any;
}

export interface PaymentProvider {
  createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  verifyWebhookSignature(signature: string, rawPayload: string, timestamp: string): boolean;
}