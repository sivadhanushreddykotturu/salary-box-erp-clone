import { withoutTenantContext, withTenantContext } from '@/lib/prisma';
import { paymentProvider } from '@/providers/payment';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { WebhookStatus } from '@prisma/client';
import crypto from 'crypto';

export class BillingService {
  async subscribeCompanyToPlan(companyId: string, planCode: string, billingCycle: 'MONTHLY' | 'YEARLY') {
    return withoutTenantContext(async (tx) => {
      const company = await tx.company.findUnique({ where: { id: companyId } });
      if (!company) throw new NotFoundError('Company not found');

      const plan = await tx.plan.findUnique({ where: { code: planCode } });
      if (!plan) throw new NotFoundError('Plan code not found');

      const amount = billingCycle === 'MONTHLY' ? plan.priceMonthly : plan.priceYearly;
      const gstAmount = Math.round(amount * 0.18);
      const totalAmount = amount + gstAmount;

      const subscriptionId = `sub_${company.companyCode}_${Date.now()}`;

      const res = await paymentProvider.createSubscription({
        subscriptionId,
        planId: plan.code,
        customerName: company.name,
        customerEmail: company.businessEmail,
        customerPhone: company.phone || '9876543210',
      });

      const startDate = new Date();
      const endDate = new Date();
      if (billingCycle === 'MONTHLY') endDate.setMonth(endDate.getMonth() + 1);
      else endDate.setFullYear(endDate.getFullYear() + 1);

      const subscription = await tx.subscription.create({
        data: {
          companyId,
          planId: plan.id,
          billingCycle,
          amount,
          gstAmount,
          totalAmount,
          startDate,
          endDate,
          status: 'ACTIVE',
          cashfreeOrderId: subscriptionId,
          invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        },
      });

      await tx.company.update({
        where: { id: companyId },
        data: {
          planId: plan.id,
          status: 'ACTIVE',
          subscriptionExpiresAt: endDate,
          cashfreeSubscriptionId: subscriptionId,
        },
      });

      return { subscription, paymentResult: res };
    });
  }

  async handleCashfreeWebhook(rawPayload: any, signature?: string, timestamp?: string) {
    return withoutTenantContext(async (tx) => {
      const eventId = rawPayload.data?.subscription_id || `cf_${Date.now()}`;
      const payloadString = JSON.stringify(rawPayload);
      const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');

      const existing = await tx.webhookEvent.findUnique({ where: { eventId } });
      if (existing) {
        return { message: 'Cashfree webhook already processed (Idempotent)', eventId };
      }

      const event = await tx.webhookEvent.create({
        data: {
          provider: 'CASHFREE',
          eventId,
          eventType: rawPayload.type || 'SUBSCRIPTION_EVENT',
          payloadHash,
          payload: rawPayload,
          status: WebhookStatus.PROCESSED,
        },
      });

      return { success: true, eventId: event.id };
    });
  }
}

export const billingService = new BillingService();