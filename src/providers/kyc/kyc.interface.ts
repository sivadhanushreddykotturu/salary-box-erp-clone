export interface AadhaarVerificationResult {
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  aadhaarLast4: string;
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  txnId: string;
  errorMessage?: string;
}

export interface PanVerificationResult {
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  panNumber: string;
  registeredName?: string;
  nameMatchScore?: number;
  category?: string;
  txnId: string;
  errorMessage?: string;
}

export interface BankVerificationResult {
  status: 'VERIFIED' | 'FAILED' | 'PENDING';
  accountNumberLast4: string;
  ifsc: string;
  registeredAccountName?: string;
  bankName?: string;
  txnId: string;
  errorMessage?: string;
}

export interface KycProvider {
  verifyAadhaarOtp(aadhaarNumber: string, otp?: string, clientRefId?: string): Promise<AadhaarVerificationResult>;
  verifyPan(panNumber: string, expectedName?: string): Promise<PanVerificationResult>;
  verifyBankAccount(accountNumber: string, ifsc: string, expectedName?: string): Promise<BankVerificationResult>;
}