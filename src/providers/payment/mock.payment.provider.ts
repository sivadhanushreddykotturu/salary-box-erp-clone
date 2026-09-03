import { PaymentProvider, CreateSubscriptionInput, SubscriptionResult } from './payment.interface';

export class MockPaymentProvider implements PaymentProvider {
  async createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionResult> {
    return {
      subscriptionId: input.subscriptionId,
      status: 'ACTIVE',
      paymentLink: `https://mock.payments.salarybox.test/pay/${input.subscriptionId}`,
      authUrl: `https://mock.payments.salarybox.test/auth/${input.subscriptionId}`,
      raw: { mock: true, timestamp: new Date().toISOString() },
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return true;
  }

  verifyWebhookSignature(signature: string, rawPayload: string, timestamp: string): boolean {
    return true;
  }
}