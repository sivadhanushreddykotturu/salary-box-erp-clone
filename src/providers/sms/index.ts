import { SmsProvider } from './sms.interface';
import { MockSmsProvider } from './mock.sms.provider';
import { Msg91SmsProvider } from './msg91.sms.provider';

export * from './sms.interface';

const smsMode = process.env.SMS_MODE || 'mock';

export const smsProvider: SmsProvider =
  smsMode === 'msg91' ? new Msg91SmsProvider() : new MockSmsProvider();

if (smsMode === 'mock') {
  console.info('[PROVIDER_INIT] ⚠️ Running with MockSmsProvider (Zero DLT waiting blocker)');
}