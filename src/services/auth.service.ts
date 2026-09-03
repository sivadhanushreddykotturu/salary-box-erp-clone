import { prisma, withoutTenantContext } from '@/lib/prisma';
import { hashPassword, comparePassword, hashPin, comparePin } from '@/lib/password';
import { generateTokens, TokenPayload } from '@/lib/jwt';
import { UnauthorizedError, ConflictError } from '@/lib/errors';
import { Role, CompanyStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

export interface RegisterCompanyInput {
  companyName: string;
  businessEmail: string;
  phone?: string;
  ownerName: string;
  password: string;
  planCode?: string;
  gstin?: string;
}

export interface LoginEmailInput {
  email: string;
  password: string;
}

export interface EmployeePinLoginInput {
  phone: string;
  pin: string;
}

export class AuthService {
  async registerCompany(input: RegisterCompanyInput) {
    return withoutTenantContext(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [
            { email: input.businessEmail.toLowerCase() },
            ...(input.phone ? [{ phone: input.phone }] : []),
          ],
        },
      });

      if (existingUser) {
        throw new ConflictError('A user with this business email or phone already exists');
      }

      let plan = await tx.plan.findFirst({
        where: { code: input.planCode || 'TRIAL_FREE' },
      });

      if (!plan) {
        plan = await tx.plan.create({
          data: {
            name: '14-Day Free Trial',
            code: 'TRIAL_FREE',
            description: 'Trial plan with all modules enabled for 14 days',
            priceMonthly: 0,
            priceYearly: 0,
            maxEmployees: 25,
            maxBranches: 2,
            availableModules: ['ATTENDANCE', 'PAYROLL', 'LEAVES', 'EXPENSES', 'CRM', 'REPORTS'],
          },
        });
      }

      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const cleanPrefix = input.companyName.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
      const companyCode = `${cleanPrefix || 'COMP'}-${randomCode}`;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);

      const company = await tx.company.create({
        data: {
          companyCode,
          name: input.companyName,
          businessEmail: input.businessEmail.toLowerCase(),
          phone: input.phone,
          gstin: input.gstin,
          status: CompanyStatus.TRIAL,
          planId: plan.id,
          subscriptionExpiresAt: expiresAt,
        },
      });

      const passwordHash = await hashPassword(input.password);
      const user = await tx.user.create({
        data: {
          companyId: company.id,
          email: input.businessEmail.toLowerCase(),
          phone: input.phone,
          passwordHash,
          role: Role.COMPANY_OWNER,
        },
      });

      const defaultBranch = await tx.branch.create({
        data: {
          companyId: company.id,
          name: 'Main Office',
          code: 'HQ',
          latitude: 12.9716,
          longitude: 77.5946,
          radiusMeters: 150,
        },
      });

      const defaultDept = await tx.department.create({
        data: {
          companyId: company.id,
          name: 'General & Administration',
        },
      });

      const defaultDesignation = await tx.designation.create({
        data: {
          companyId: company.id,
          title: 'Managing Director',
        },
      });

      const defaultShift = await tx.shift.create({
        data: {
          companyId: company.id,
          name: 'General Day Shift (9 AM - 6 PM)',
          startTime: '09:00',
          endTime: '18:00',
          graceTimeMinutes: 15,
          fullDayMinutes: 480,
          halfDayMinutes: 240,
        },
      });

      await tx.attendanceRule.create({
        data: {
          companyId: company.id,
          geofenceMandatory: true,
          preventMockGPS: true,
          autoCheckoutAtShiftEnd: true,
        },
      });

      await tx.leaveType.createMany({
        data: [
          { companyId: company.id, name: 'Casual Leave', code: 'CL', daysPerYear: 12, isPaid: true },
          { companyId: company.id, name: 'Sick Leave', code: 'SL', daysPerYear: 12, isPaid: true },
          { companyId: company.id, name: 'Earned Leave', code: 'EL', daysPerYear: 15, isPaid: true },
        ],
      });

      const nameParts = input.ownerName.trim().split(' ');
      const firstName = nameParts[0] || 'Owner';
      const lastName = nameParts.slice(1).join(' ') || '';

      const employee = await tx.employee.create({
        data: {
          companyId: company.id,
          userId: user.id,
          employeeCode: 'EMP001',
          firstName,
          lastName,
          dateOfJoining: new Date(),
          branchId: defaultBranch.id,
          departmentId: defaultDept.id,
          designationId: defaultDesignation.id,
          shiftId: defaultShift.id,
        },
      });

      const tokenPayload: TokenPayload = {
        userId: user.id,
        role: user.role,
        companyId: company.id,
        email: user.email,
        phone: user.phone,
        employeeId: employee.id,
      };

      const tokens = generateTokens(tokenPayload);

      await logAuditEvent(tx as any, {
        companyId: company.id,
        userId: user.id,
        action: 'COMPANY_REGISTERED',
        resource: 'Company',
        resourceId: company.id,
        metadata: { companyCode, plan: plan.code },
      });

      return {
        company: {
          id: company.id,
          name: company.name,
          companyCode: company.companyCode,
          status: company.status,
          subscriptionExpiresAt: company.subscriptionExpiresAt,
        },
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          employeeId: employee.id,
        },
        tokens,
      };
    });
  }

  async loginWithEmail(input: LoginEmailInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        company: true,
        employee: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your account has been deactivated. Please contact your company admin.');
    }

    if (user.company && user.company.status === CompanyStatus.SUSPENDED) {
      throw new UnauthorizedError('Company account is suspended. Please contact support.');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
      email: user.email,
      phone: user.phone,
      employeeId: user.employee?.id,
    };

    const tokens = generateTokens(tokenPayload);

    await logAuditEvent(prisma, {
      companyId: user.companyId,
      userId: user.id,
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user.id,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name,
        companyCode: user.company?.companyCode,
        employeeId: user.employee?.id,
      },
      tokens,
    };
  }

  async loginEmployeeWithPin(input: EmployeePinLoginInput) {
    const cleanPhone = input.phone.replace(/\D/g, '');
    const user = await prisma.user.findFirst({
      where: {
        phone: { contains: cleanPhone.slice(-10) },
      },
      include: {
        company: true,
        employee: {
          include: {
            branch: true,
            shift: true,
            designation: true,
          },
        },
      },
    });

    if (!user || !user.pinHash) {
      throw new UnauthorizedError('Invalid phone number or PIN not set');
    }

    const isMatch = await comparePin(input.pin, user.pinHash);
    if (!isMatch) {
      throw new UnauthorizedError('Incorrect 4/6-digit PIN');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Your employee account has been deactivated');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
      phone: user.phone,
      email: user.email,
      employeeId: user.employee?.id,
    };

    const tokens = generateTokens(tokenPayload);

    await logAuditEvent(prisma, {
      companyId: user.companyId,
      userId: user.id,
      action: 'EMPLOYEE_PIN_LOGIN',
      resource: 'Employee',
      resourceId: user.employee?.id,
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        companyId: user.companyId,
        companyName: user.company?.name,
        employee: user.employee,
      },
      tokens,
    };
  }

  async loginSuperAdmin(email: string, password: string) {
    const admin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      throw new UnauthorizedError('Invalid Super Admin credentials');
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid Super Admin credentials');
    }

    const tokenPayload: TokenPayload = {
      userId: admin.id,
      role: Role.SUPER_ADMIN,
      companyId: null,
      email: admin.email,
    };

    const tokens = generateTokens(tokenPayload);
    return { admin: { id: admin.id, email: admin.email, name: admin.name }, tokens };
  }
}

export const authService = new AuthService();