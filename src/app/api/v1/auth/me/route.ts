import { NextRequest } from 'next/server';
import { extractAuthUser } from '@/middleware/auth.middleware';
import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/response';
import { NotFoundError } from '@/lib/errors';

export async function GET(req: NextRequest) {
  try {
    const authUser = extractAuthUser(req);
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        companyId: true,
        isActive: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
            companyCode: true,
            status: true,
            subscriptionExpiresAt: true,
            plan: {
              select: {
                id: true,
                name: true,
                code: true,
                availableModules: true,
                maxEmployees: true,
                maxBranches: true,
              },
            },
          },
        },
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            branch: true,
            department: true,
            designation: true,
            shift: true,
            kyc: {
              select: {
                aadhaarNumber: true,
                aadhaarLast4: true,
                aadhaarStatus: true,
                panNumber: true,
                panStatus: true,
                bankAccountNumber: true,
                bankAccountLast4: true,
                ifscCode: true,
                bankStatus: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return jsonResponse(user, 200);
  } catch (error) {
    return errorResponse(error);
  }
}