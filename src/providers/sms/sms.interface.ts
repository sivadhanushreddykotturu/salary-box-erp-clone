export interface SmsProvider {
  sendOtp(phone: string, otp: string): Promise<boolean>;
  sendTransactionalSms(phone: string, message: string, templateId?: string): Promise<boolean>;
}