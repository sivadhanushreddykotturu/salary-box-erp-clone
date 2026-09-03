import { NextRequest } from 'next/server';
import { verifyAccessToken, TokenPayload } from '@/lib/jwt';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors';
import { Role } from '@prisma/client';

export function extractAuthUser(req: NextRequest): TokenPayload {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    return verifyAccessToken(token);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}

export function requireRoles(user: TokenPayload, allowedRoles: Role[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(
      `Access denied. Requires one of roles: [${allowedRoles.join(', ')}], but current role is ${user.role}`
    );
  }
}

export function requireTenantContext(user: TokenPayload): string {
  if (!user.companyId) {
    throw new ForbiddenError('Tenant company ID missing from authentication session');
  }
  return user.companyId;
}