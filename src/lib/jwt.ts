import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'erp-hrms-super-secret-jwt-key-32chars';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'erp-hrms-refresh-super-secret-key-32chars';

export interface TokenPayload {
  userId: string;
  role: Role;
  companyId?: string | null;
  phone?: string | null;
  email?: string | null;
  employeeId?: string | null;
}

export function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
  });

  const refreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  });

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
}