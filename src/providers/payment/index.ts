import { PaymentProvider } from './payment.interface';
import { MockPaymentProvider } from './mock.payment.provider';
import { CashfreePaymentProvider } from './cashfree.payment.provider';

export * from './payment.interface';

const paymentMode = process.env.PAYMENT_MODE || 'mock';

export const paymentProvider: PaymentProvider =
  paymentMode === 'cashfree' ? new CashfreePaymentProvider() : new MockPaymentProvider();

if (paymentMode === 'mock') {
  console.info('[PROVIDER_INIT] ⚠️ Running with MockPaymentProvider (SaaS Subscriptions Mocked)');
}