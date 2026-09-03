import { SmsProvider } from './sms.interface';

export class Msg91SmsProvider implements SmsProvider {
  private authKey: string;
  private senderId: string;

  constructor() {
    this.authKey = process.env.MSG91_AUTH_KEY || '';
    this.senderId = process.env.MSG91_SENDER_ID || 'SALBOX';
  }

  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_DLT_TE_ID}&mobile=${cleanPhone}&authkey=${this.authKey}&otp=${otp}`;
    const response = await fetch(url, { method: 'POST' });
    return response.ok;
  }

  async sendTransactionalSms(phone: string, message: string, templateId?: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    const response = await fetch('https://control.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': this.authKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        template_id: templateId || process.env.MSG91_DLT_TE_ID,
        sender: this.senderId,
        mobiles: cleanPhone,
        VAR1: message,
      }),
    });
    return response.ok;
  }
}