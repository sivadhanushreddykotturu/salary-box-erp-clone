import { SmsProvider } from './sms.interface';

export class MockSmsProvider implements SmsProvider {
  async sendOtp(phone: string, otp: string): Promise<boolean> {
    console.info(`[MOCK_SMS_OTP] Sent OTP ${otp} to ${phone}`);
    return true;
  }

  async sendTransactionalSms(phone: string, message: string, templateId?: string): Promise<boolean> {
    console.info(`[MOCK_SMS] Sent to ${phone}: ${message}`);
    return true;
  }
}