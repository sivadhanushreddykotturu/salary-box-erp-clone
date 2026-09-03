import { NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyRefreshToken, generateTokens, TokenPayload } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/response';
import { UnauthorizedError } from '@/lib/errors';

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = refreshSchema.parse(body);
    const { userId } = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { employee: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User session expired or user deactivated');
    }

    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
      email: user.email,
      phone: user.phone,
      employeeId: user.employee?.id,
    };

    const tokens = generateTokens(payload);
    return jsonResponse(tokens, 200, 'Tokens refreshed successfully');
  } catch (error) {
    return errorResponse(error);
  }
}