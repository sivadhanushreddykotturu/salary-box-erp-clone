import { KycProvider, AadhaarVerificationResult, PanVerificationResult, BankVerificationResult } from './kyc.interface';

export class DecentroKycProvider implements KycProvider {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private moduleSecret: string;

  constructor() {
    this.baseUrl = process.env.DECENTRO_BASE_URL || 'https://in.staging.decentro.tech';
    this.clientId = process.env.DECENTRO_CLIENT_ID || '';
    this.clientSecret = process.env.DECENTRO_CLIENT_SECRET || '';
    this.moduleSecret = process.env.DECENTRO_MODULE_SECRET || '';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'client_id': this.clientId,
      'client_secret': this.clientSecret,
      'module_secret': this.moduleSecret,
    };
  }

  async verifyAadhaarOtp(aadhaarNumber: string, otp?: string, clientRefId?: string): Promise<AadhaarVerificationResult> {
    const response = await fetch(`${this.baseUrl}/v2/kyc/aadhaar/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        aadhaar_number: aadhaarNumber,
        otp,
        reference_id: clientRefId || `aadhaar_${Date.now()}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.status === 'FAILURE') {
      return {
        status: 'FAILED',
        aadhaarLast4: aadhaarNumber.slice(-4),
        txnId: data.decentroTxnId || '',
        errorMessage: data.message || 'Decentro Aadhaar verification failed',
      };
    }

    return {
      status: 'VERIFIED',
      aadhaarLast4: aadhaarNumber.slice(-4),
      name: data.data?.name,
      dob: data.data?.dob,
      gender: data.data?.gender,
      txnId: data.decentroTxnId,
    };
  }

  async verifyPan(panNumber: string, expectedName?: string): Promise<PanVerificationResult> {
    const response = await fetch(`${this.baseUrl}/v2/kyc/pan/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        pan_number: panNumber.toUpperCase(),
        name: expectedName,
        reference_id: `pan_${Date.now()}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.status === 'FAILURE') {
      return {
        status: 'FAILED',
        panNumber: panNumber.toUpperCase(),
        txnId: data.decentroTxnId || '',
        errorMessage: data.message || 'Decentro PAN verification failed',
      };
    }

    return {
      status: 'VERIFIED',
      panNumber: panNumber.toUpperCase(),
      registeredName: data.data?.name,
      nameMatchScore: data.data?.name_match_score,
      txnId: data.decentroTxnId,
    };
  }

  async verifyBankAccount(accountNumber: string, ifsc: string, expectedName?: string): Promise<BankVerificationResult> {
    const response = await fetch(`${this.baseUrl}/v2/kyc/bank/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        account_number: accountNumber,
        ifsc: ifsc.toUpperCase(),
        name: expectedName,
        reference_id: `bank_${Date.now()}`,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.status === 'FAILURE') {
      return {
        status: 'FAILED',
        accountNumberLast4: accountNumber.slice(-4),
        ifsc,
        txnId: data.decentroTxnId || '',
        errorMessage: data.message || 'Decentro bank verification failed',
      };
    }

    return {
      status: 'VERIFIED',
      accountNumberLast4: accountNumber.slice(-4),
      ifsc,
      registeredAccountName: data.data?.beneficiary_name,
      bankName: data.data?.bank_name,
      txnId: data.decentroTxnId,
    };
  }
}