import { KycProvider, AadhaarVerificationResult, PanVerificationResult, BankVerificationResult } from './kyc.interface';

export class MockKycProvider implements KycProvider {
  async verifyAadhaarOtp(aadhaarNumber: string, otp?: string, clientRefId?: string): Promise<AadhaarVerificationResult> {
    const cleanNumber = aadhaarNumber.replace(/\s+/g, '');
    const last4 = cleanNumber.slice(-4);

    if (cleanNumber.endsWith('0000')) {
      return {
        status: 'FAILED',
        aadhaarLast4: last4,
        txnId: `mock_txn_aadhaar_fail_${Date.now()}`,
        errorMessage: 'Invalid Aadhaar number: Failed UIDAI checksum validation',
      };
    }

    return {
      status: 'VERIFIED',
      aadhaarLast4: last4,
      name: 'Ramesh Sharma',
      dob: '1992-05-14',
      gender: 'MALE',
      address: 'Plot 42, HSR Layout, Sector 2, Bengaluru, Karnataka 560102',
      txnId: `mock_txn_aadhaar_${Date.now()}`,
    };
  }

  async verifyPan(panNumber: string, expectedName?: string): Promise<PanVerificationResult> {
    const pan = panNumber.toUpperCase().trim();

    if (pan.endsWith('X')) {
      return {
        status: 'FAILED',
        panNumber: pan,
        txnId: `mock_txn_pan_fail_${Date.now()}`,
        errorMessage: 'PAN record not found with NSDL directory',
      };
    }

    return {
      status: 'VERIFIED',
      panNumber: pan,
      registeredName: expectedName || 'RAMESH SHARMA',
      nameMatchScore: 100,
      category: 'Individual',
      txnId: `mock_txn_pan_${Date.now()}`,
    };
  }

  async verifyBankAccount(accountNumber: string, ifsc: string, expectedName?: string): Promise<BankVerificationResult> {
    const cleanAccount = accountNumber.trim();
    const last4 = cleanAccount.slice(-4);

    if (cleanAccount.endsWith('0000')) {
      return {
        status: 'FAILED',
        accountNumberLast4: last4,
        ifsc: ifsc.toUpperCase(),
        txnId: `mock_txn_bank_fail_${Date.now()}`,
        errorMessage: 'Bank account number does not exist or beneficiary bank rejected penny drop',
      };
    }

    return {
      status: 'VERIFIED',
      accountNumberLast4: last4,
      ifsc: ifsc.toUpperCase(),
      registeredAccountName: expectedName || 'RAMESH SHARMA',
      bankName: 'HDFC BANK LIMITED',
      txnId: `mock_txn_bank_${Date.now()}`,
    };
  }
}