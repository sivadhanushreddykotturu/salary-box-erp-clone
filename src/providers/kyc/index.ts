import { KycProvider } from './kyc.interface';
import { MockKycProvider } from './mock.kyc.provider';
import { DecentroKycProvider } from './decentro.kyc.provider';

export * from './kyc.interface';

const kycMode = process.env.KYC_MODE || 'mock';

export const kycProvider: KycProvider =
  kycMode === 'decentro' ? new DecentroKycProvider() : new MockKycProvider();

if (kycMode === 'mock') {
  console.info('[PROVIDER_INIT] ⚠️ Running with MockKycProvider (No real Decentro API calls)');
}