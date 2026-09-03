import { withTenantContext, withoutTenantContext } from '@/lib/prisma';
import { kycProvider } from '@/providers/kyc';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { VerificationStatus, WebhookStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';
import crypto from 'crypto';

export class KycService {
  async verifyAadhaar(companyId: string, employeeId: string, aadhaarNumber: string, otp?: string, userId?: string) {
    const cleanNumber = aadhaarNumber.replace(/\s+/g, '');
    if (cleanNumber.length !== 12) {
      throw new ValidationError('Aadhaar number must be exactly 12 digits');
    }

    const result = await kycProvider.verifyAadhaarOtp(cleanNumber, otp);

    return withTenantContext(companyId, async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee || employee.companyId !== companyId) {
        throw new NotFoundError('Employee not found in this company');
      }

      const status: VerificationStatus =
        result.status === 'VERIFIED'
          ? VerificationStatus.VERIFIED
          : result.status === 'FAILED'
          ? VerificationStatus.FAILED
          : VerificationStatus.PENDING;

      const kyc = await tx.employeeKYC.upsert({
        where: { employeeId },
        create: {
          employeeId,
          aadhaarNumber: cleanNumber,
          aadhaarLast4: result.aadhaarLast4,
          aadhaarStatus: status,
          decentroAadhaarTxnId: result.txnId,
          verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
        },
        update: {
          aadhaarNumber: cleanNumber,
          aadhaarLast4: result.aadhaarLast4,
          aadhaarStatus: status,
          decentroAadhaarTxnId: result.txnId,
          verifiedAt: status === VerificationStatus.VERIFIED ? new Date() : null,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'AADHAAR_VERIFIED',
        resource: 'EmployeeKYC',
        resourceId: kyc.id,
        metadata: { status, txnId: result.txnId },
      });

      return { kyc, result };
    });
  }

  async verifyPan(companyId: string, employeeId: string, panNumber: string, userId?: string) {
    const cleanPan = panNumber.toUpperCase().trim();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
      throw new ValidationError('Invalid PAN format (e.g. ABCDE1234F)');
    }

    return withTenantContext(companyId, async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee || employee.companyId !== companyId) {
        throw new NotFoundError('Employee not found');
      }

      const fullName = `${employee.firstName} ${employee.lastName || ''}`.trim();
      const result = await kycProvider.verifyPan(cleanPan, fullName);

      const status: VerificationStatus =
        result.status === 'VERIFIED'
          ? VerificationStatus.VERIFIED
          : result.status === 'FAILED'
          ? VerificationStatus.FAILED
          : VerificationStatus.PENDING;

      const kyc = await tx.employeeKYC.upsert({
        where: { employeeId },
        create: {
          employeeId,
          panNumber: cleanPan,
          panStatus: status,
          panLegalName: result.registeredName,
          panNameMatchScore: result.nameMatchScore,
        },
        update: {
          panNumber: cleanPan,
          panStatus: status,
          panLegalName: result.registeredName,
          panNameMatchScore: result.nameMatchScore,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'PAN_VERIFIED',
        resource: 'EmployeeKYC',
        resourceId: kyc.id,
        metadata: { status, txnId: result.txnId },
      });

      return { kyc, result };
    });
  }

  async verifyBankAccount(
    companyId: string,
    employeeId: string,
    accountNumber: string,
    ifsc: string,
    userId?: string
  ) {
    const cleanAccount = accountNumber.trim();
    const cleanIfsc = ifsc.toUpperCase().trim();

    return withTenantContext(companyId, async (tx) => {
      const employee = await tx.employee.findUnique({ where: { id: employeeId } });
      if (!employee || employee.companyId !== companyId) {
        throw new NotFoundError('Employee not found');
      }

      const fullName = `${employee.firstName} ${employee.lastName || ''}`.trim();
      const result = await kycProvider.verifyBankAccount(cleanAccount, cleanIfsc, fullName);

      const status: VerificationStatus =
        result.status === 'VERIFIED'
          ? VerificationStatus.VERIFIED
          : result.status === 'FAILED'
          ? VerificationStatus.FAILED
          : VerificationStatus.PENDING;

      const kyc = await tx.employeeKYC.upsert({
        where: { employeeId },
        create: {
          employeeId,
          bankAccountNumber: cleanAccount,
          bankAccountLast4: result.accountNumberLast4,
          ifscCode: cleanIfsc,
          bankAccountName: result.registeredAccountName,
          bankStatus: status,
          decentroBankTxnId: result.txnId,
        },
        update: {
          bankAccountNumber: cleanAccount,
          bankAccountLast4: result.accountNumberLast4,
          ifscCode: cleanIfsc,
          bankAccountName: result.registeredAccountName,
          bankStatus: status,
          decentroBankTxnId: result.txnId,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'BANK_ACCOUNT_VERIFIED',
        resource: 'EmployeeKYC',
        resourceId: kyc.id,
        metadata: { status, txnId: result.txnId },
      });

      return { kyc, result };
    });
  }

  async handleDecentroWebhook(rawPayload: any, signature?: string) {
    return withoutTenantContext(async (tx) => {
      const eventId = rawPayload.decentroTxnId || `decentro_${Date.now()}`;
      const payloadString = JSON.stringify(rawPayload);
      const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');

      // Idempotency check
      const existing = await tx.webhookEvent.findUnique({ where: { eventId } });
      if (existing) {
        return { message: 'Webhook already processed (Idempotent)', eventId };
      }

      const event = await tx.webhookEvent.create({
        data: {
          provider: 'DECENTRO',
          eventId,
          eventType: rawPayload.event || 'KYC_CALLBACK',
          payloadHash,
          payload: rawPayload,
          status: WebhookStatus.PROCESSED,
        },
      });

      return { success: true, eventId: event.id };
    });
  }
}

export const kycService = new KycService();