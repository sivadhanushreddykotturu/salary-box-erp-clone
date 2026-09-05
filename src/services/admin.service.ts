import { withTenantContext } from '@/lib/prisma';
import { NotFoundError, ValidationError, ConflictError } from '@/lib/errors';
import { logAuditEvent } from '@/lib/audit';
import { hashPassword, hashPin } from '@/lib/password';
import { Role } from '@prisma/client';

export interface CreateAdminInput {
  name: string;
  phone: string;
  email?: string;
}

export interface UpdateAdminInput {
  name?: string;
  phone?: string;
  email?: string;
}

export class AdminService {
  /**
   * Get all admins for a company
   */
  async getAdmins(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      // Find all users with admin-level roles or employees with userRole Admin
      const users = await tx.user.findMany({
        where: {
          companyId,
          OR: [
            { role: Role.COMPANY_OWNER },
            { role: Role.HR_ADMIN },
            { role: Role.SUPER_ADMIN },
            { employee: { userRole: { in: ['Admin', 'Company Owner', 'HR Admin'] } } },
          ],
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              jobTitle: true,
              avatarUrl: true,
              userRole: true,
              employeeCode: true,
              mobileNumber: true,
              officialEmail: true,
              personalEmail: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Format response list
      const admins = users.map((u) => {
        const emp = u.employee;
        const fullName = emp
          ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Admin'
          : u.email?.split('@')[0] || 'Admin';

        // Extract initials
        const nameParts = fullName.split(' ').filter(Boolean);
        const initials =
          nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : (fullName.slice(0, 2) || 'AD').toUpperCase();

        const phone = u.phone || emp?.mobileNumber || '';
        const formattedPhone = phone
          ? phone.startsWith('+91')
            ? phone
            : `+91${phone.replace(/\D/g, '').slice(-10)}`
          : '';

        return {
          id: u.id,
          employeeId: emp?.id || null,
          name: fullName,
          initials,
          phone: formattedPhone,
          rawPhone: phone.replace(/\D/g, '').slice(-10),
          email: u.email || emp?.officialEmail || emp?.personalEmail || '',
          role: u.role,
          userRole: emp?.userRole || (u.role === Role.COMPANY_OWNER ? 'Company Owner' : 'Admin'),
          createdAt: u.createdAt,
        };
      });

      // If no admin user is in the DB yet, provide the primary company owner info
      if (admins.length === 0) {
        const company = await tx.company.findUnique({ where: { id: companyId } });
        return [
          {
            id: 'owner-default',
            employeeId: null,
            name: 'PAPPU SRINIVASA PRABHAKAR RAO',
            initials: 'PR',
            phone: '+919542843456',
            rawPhone: '9542843456',
            email: company?.businessEmail || 'admin@rsslogistics.in',
            role: Role.COMPANY_OWNER,
            userRole: 'Company Owner',
            createdAt: new Date(),
          },
        ];
      }

      return admins;
    });
  }

  /**
   * Create a new Admin for a company
   */
  async createAdmin(companyId: string, input: CreateAdminInput, currentUserId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const cleanPhone = input.phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length < 10) {
        throw new ValidationError('Please provide a valid 10-digit mobile number');
      }

      const formattedPhone = `+91${cleanPhone}`;
      const email = input.email?.trim().toLowerCase() || `${cleanPhone}@rsslogistics.in`;

      // Check if user already exists
      const existingUser = await tx.user.findFirst({
        where: {
          OR: [
            { phone: formattedPhone },
            { phone: cleanPhone },
            ...(input.email ? [{ email: input.email.toLowerCase() }] : []),
          ],
        },
        include: { employee: true },
      });

      if (existingUser) {
        if (existingUser.companyId === companyId) {
          // Promote existing user to HR_ADMIN
          const updated = await tx.user.update({
            where: { id: existingUser.id },
            data: { role: Role.HR_ADMIN },
            include: { employee: true },
          });

          if (existingUser.employee) {
            await tx.employee.update({
              where: { id: existingUser.employee.id },
              data: { userRole: 'Admin' },
            });
          }

          return updated;
        } else {
          throw new ConflictError('A user with this mobile number or email already belongs to another company');
        }
      }

      // Generate default credentials
      const defaultPassword = await hashPassword('Admin@123');
      const defaultPin = await hashPin('1234');

      // Create User
      const newUser = await tx.user.create({
        data: {
          companyId,
          phone: formattedPhone,
          email,
          passwordHash: defaultPassword,
          pinHash: defaultPin,
          role: Role.HR_ADMIN,
        },
      });

      // Split name into firstName & lastName
      const nameParts = input.name.trim().split(' ');
      const firstName = nameParts[0] || 'Admin';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Get or create a default branch and department
      const branch = await tx.branch.findFirst({ where: { companyId } });
      const department = await tx.department.findFirst({ where: { companyId } });

      // Generate employee code
      const count = await tx.employee.count({ where: { companyId } });
      const employeeCode = `ADM${String(count + 1).padStart(3, '0')}`;

      // Create Employee Record
      const newEmployee = await tx.employee.create({
        data: {
          companyId,
          userId: newUser.id,
          employeeCode,
          firstName,
          lastName,
          mobileNumber: formattedPhone,
          officialEmail: email,
          dateOfJoining: new Date(),
          userRole: 'Admin',
          branchId: branch?.id,
          departmentId: department?.id,
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId: currentUserId,
        action: 'ADMIN_CREATED',
        resource: 'User',
        resourceId: newUser.id,
        metadata: { name: input.name, phone: formattedPhone, email },
      });

      return {
        id: newUser.id,
        employeeId: newEmployee.id,
        name: input.name.trim(),
        phone: formattedPhone,
        email,
        role: newUser.role,
        userRole: 'Admin',
      };
    });
  }

  /**
   * Update an existing admin
   */
  async updateAdmin(
    companyId: string,
    adminId: string,
    input: UpdateAdminInput,
    currentUserId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      // Find the user or employee
      const user = await tx.user.findFirst({
        where: { id: adminId, companyId },
        include: { employee: true },
      });

      if (!user) {
        throw new NotFoundError('Admin user not found');
      }

      const updateUserData: any = {};
      const updateEmployeeData: any = {};

      if (input.phone) {
        const cleanPhone = input.phone.replace(/\D/g, '').slice(-10);
        if (cleanPhone.length < 10) {
          throw new ValidationError('Please provide a valid 10-digit mobile number');
        }
        const formattedPhone = `+91${cleanPhone}`;
        updateUserData.phone = formattedPhone;
        updateEmployeeData.mobileNumber = formattedPhone;
      }

      if (input.email !== undefined) {
        const cleanEmail = input.email.trim().toLowerCase() || null;
        updateUserData.email = cleanEmail;
        updateEmployeeData.officialEmail = cleanEmail;
      }

      if (input.name) {
        const nameParts = input.name.trim().split(' ');
        updateEmployeeData.firstName = nameParts[0] || 'Admin';
        updateEmployeeData.lastName = nameParts.slice(1).join(' ') || '';
      }

      // Update User
      if (Object.keys(updateUserData).length > 0) {
        await tx.user.update({
          where: { id: adminId },
          data: updateUserData,
        });
      }

      // Update Employee
      if (user.employee && Object.keys(updateEmployeeData).length > 0) {
        await tx.employee.update({
          where: { id: user.employee.id },
          data: updateEmployeeData,
        });
      }

      await logAuditEvent(tx as any, {
        companyId,
        userId: currentUserId,
        action: 'ADMIN_UPDATED',
        resource: 'User',
        resourceId: adminId,
        metadata: input,
      });

      return {
        id: user.id,
        name: input.name || `${user.employee?.firstName || ''} ${user.employee?.lastName || ''}`.trim(),
        phone: updateUserData.phone || user.phone,
        email: updateUserData.email !== undefined ? updateUserData.email : user.email,
      };
    });
  }

  /**
   * Delete / Remove an admin
   */
  async deleteAdmin(companyId: string, adminId: string, currentUserId?: string) {
    return withTenantContext(companyId, async (tx) => {
      // Check total admin count to prevent company lockout
      const adminCount = await tx.user.count({
        where: {
          companyId,
          OR: [
            { role: Role.COMPANY_OWNER },
            { role: Role.HR_ADMIN },
            { employee: { userRole: { in: ['Admin', 'Company Owner'] } } },
          ],
        },
      });

      if (adminCount <= 1) {
        throw new ValidationError('Cannot delete the only remaining admin of the company.');
      }

      const user = await tx.user.findFirst({
        where: { id: adminId, companyId },
        include: { employee: true },
      });

      if (!user) {
        throw new NotFoundError('Admin user not found');
      }

      // If user has employee record, delete or unassign
      if (user.employee) {
        await tx.employee.delete({
          where: { id: user.employee.id },
        });
      }

      await tx.user.delete({
        where: { id: adminId },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId: currentUserId,
        action: 'ADMIN_DELETED',
        resource: 'User',
        resourceId: adminId,
      });

      return { success: true };
    });
  }
}

export const adminService = new AdminService();
