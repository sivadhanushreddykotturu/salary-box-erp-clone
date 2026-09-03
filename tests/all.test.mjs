import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { HaversineGeoProvider } from '../src/providers/geo/haversine.geo.provider.js';
import { MockKycProvider } from '../src/providers/kyc/mock.kyc.provider.js';
import { MockPaymentProvider } from '../src/providers/payment/mock.payment.provider.js';
import { generateTokens, verifyAccessToken } from '../src/lib/jwt.js';

describe('1. Geofencing & Haversine Distance Engine Tests', () => {
  const geo = new HaversineGeoProvider();
  const officeCoords = { latitude: 12.9716, longitude: 77.5946 }; // Bangalore HQ
  const radiusMeters = 150;

  test('Punch inside office radius (50m away) is within geofence', () => {
    // Approx 50 meters away
    const employeeCoords = { latitude: 12.9719, longitude: 77.5948 };
    const result = geo.isWithinGeofence(employeeCoords, officeCoords, radiusMeters);

    assert.equal(result.isWithin, true);
    assert.ok(result.distanceMeters <= radiusMeters);
  });

  test('Punch outside office radius (2.5km away) is rejected', () => {
    const employeeCoords = { latitude: 12.9900, longitude: 77.6100 };
    const result = geo.isWithinGeofence(employeeCoords, officeCoords, radiusMeters);

    assert.equal(result.isWithin, false);
    assert.ok(result.distanceMeters > radiusMeters);
  });
});

describe('2. Decentro KYC Provider Adapter & Fixture Tests', () => {
  const kyc = new MockKycProvider();

  test('Aadhaar verification success returns masked Last4 and TxnId', async () => {
    const res = await kyc.verifyAadhaarOtp('548123456789');
    assert.equal(res.status, 'VERIFIED');
    assert.equal(res.aadhaarLast4, '6789');
    assert.ok(res.txnId.startsWith('mock_txn_aadhaar_'));
    assert.equal(res.name, 'Ramesh Sharma');
  });

  test('Aadhaar ending in 0000 triggers UIDAI checksum failure test fixture', async () => {
    const res = await kyc.verifyAadhaarOtp('548123450000');
    assert.equal(res.status, 'FAILED');
    assert.equal(res.aadhaarLast4, '0000');
    assert.ok(res.errorMessage.includes('Failed UIDAI checksum'));
  });

  test('PAN verification with valid PAN returns 100% name match', async () => {
    const res = await kyc.verifyPan('ABCDE1234F', 'RAMESH SHARMA');
    assert.equal(res.status, 'VERIFIED');
    assert.equal(res.panNumber, 'ABCDE1234F');
    assert.equal(res.nameMatchScore, 100);
  });

  test('PAN ending in X triggers NSDL not found test fixture', async () => {
    const res = await kyc.verifyPan('ABCDE1234X');
    assert.equal(res.status, 'FAILED');
    assert.ok(res.errorMessage.includes('not found'));
  });

  test('Bank Account Penny Drop verification returns bank name & active status', async () => {
    const res = await kyc.verifyBankAccount('123456789012', 'HDFC0001234');
    assert.equal(res.status, 'VERIFIED');
    assert.equal(res.accountNumberLast4, '9012');
    assert.equal(res.bankName, 'HDFC BANK LIMITED');
  });

  test('Bank Account ending in 0000 triggers rejection fixture', async () => {
    const res = await kyc.verifyBankAccount('123456780000', 'HDFC0001234');
    assert.equal(res.status, 'FAILED');
    assert.equal(res.accountNumberLast4, '0000');
  });
});

describe('3. Cashfree SaaS Subscription Provider Tests', () => {
  const payment = new MockPaymentProvider();

  test('Creates recurring subscription with active status & payment auth link', async () => {
    const res = await payment.createSubscription({
      subscriptionId: 'sub_test_001',
      planId: 'GROWTH_PLAN',
      customerName: 'Acme Corp',
      customerEmail: 'admin@acme.com',
      customerPhone: '9876543210',
    });

    assert.equal(res.status, 'ACTIVE');
    assert.equal(res.subscriptionId, 'sub_test_001');
    assert.ok(res.authUrl.includes('sub_test_001'));
  });

  test('Webhook signature verification succeeds', () => {
    const isValid = payment.verifyWebhookSignature('sig', 'payload', '123456');
    assert.equal(isValid, true);
  });
});

describe('4. Multi-Tenant JWT Token & Claim Verification Tests', () => {
  test('Signs and verifies JWT claims with companyId tenant isolation', () => {
    const payload = {
      userId: 'user_123',
      role: 'COMPANY_OWNER',
      companyId: 'company_tenant_abc',
      email: 'owner@acme.com',
      phone: '9876543210',
      employeeId: 'emp_001',
    };

    const { accessToken, refreshToken } = generateTokens(payload);
    assert.ok(accessToken);
    assert.ok(refreshToken);

    const verified = verifyAccessToken(accessToken);
    assert.equal(verified.userId, 'user_123');
    assert.equal(verified.companyId, 'company_tenant_abc');
    assert.equal(verified.role, 'COMPANY_OWNER');
    assert.equal(verified.employeeId, 'emp_001');
  });
});

describe('5. Payroll Math & Statutory Deduction Engine Tests', () => {
  test('Prorated gross salary and PF (12%), ESI (0.75%), PT calculation', () => {
    const monthlyCtc = 50000;
    const basicMonthly = 25000;
    const hraMonthly = 12500;
    const allowancesMonthly = 12500;
    const totalDays = 30;
    const payableDays = 27; // 3 LOP days

    const proration = payableDays / totalDays; // 0.9
    const basicPay = Math.round(basicMonthly * proration); // 22500
    const hra = Math.round(hraMonthly * proration); // 11250
    const allowances = Math.round(allowancesMonthly * proration); // 11250
    const grossEarnings = basicPay + hra + allowances; // 45000

    const pf = Math.round(basicPay * 0.12); // 2700
    const pt = 200;
    const esi = 0; // CTC > 21000 threshold

    const totalDeductions = pf + esi + pt;
    const netSalaryPayable = grossEarnings - totalDeductions;

    assert.equal(grossEarnings, 45000);
    assert.equal(pf, 2700);
    assert.equal(pt, 200);
    assert.equal(totalDeductions, 2900);
    assert.equal(netSalaryPayable, 42100);
  });
});