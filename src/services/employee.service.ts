import { withTenantContext } from '@/lib/prisma';
import { hashPassword, hashPin } from '@/lib/password';
import { storageProvider } from '@/providers/storage/s3.storage.provider';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { Role, EmployeeStatus, VerificationStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

export interface CreateEmployeeInput {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  pin?: string;
  dateOfJoining: string;
  branchId?: string;
  departmentId?: string;
  designationId?: string;
  shiftId?: string;
  reportingManagerId?: string;
  salaryStructureId?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export class EmployeeService {
  async getEmployees(companyId: string, filters?: { branchId?: string; departmentId?: string; search?: string }) {
    return withTenantContext(companyId, async (tx) => {
      return tx.employee.findMany({
        where: {
          companyId,
          ...(filters?.branchId ? { branchId: filters.branchId } : {}),
          ...(filters?.departmentId ? { departmentId: filters.departmentId } : {}),
          ...(filters?.search
            ? {
                OR: [
                  { firstName: { contains: filters.search, mode: 'insensitive' } },
                  { lastName: { contains: filters.search, mode: 'insensitive' } },
                  { employeeCode: { contains: filters.search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        include: {
          user: { select: { phone: true, email: true, role: true, isActive: true } },
          branch: true,
          department: true,
          designation: true,
          shift: true,
          kyc: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async getEmployeeById(companyId: string, id: string) {
    return withTenantContext(companyId, async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id },
        include: {
          user: { select: { phone: true, email: true, role: true, isActive: true } },
          branch: true,
          department: true,
          designation: true,
          shift: true,
          kyc: true,
          documents: true,
          salaryStructure: true,
          reportingManager: { select: { id: true, firstName: true, lastName: true, employeeCode: true } },
        },
      });

      if (!employee || employee.companyId !== companyId) {
        throw new NotFoundError('Employee not found');
      }

      return employee;
    });
  }

  async createEmployee(companyId: string, input: CreateEmployeeInput, creatorUserId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const cleanPhone = input.phone.replace(/\D/g, '');
      const existingUser = await tx.user.findFirst({
        where: { phone: cleanPhone },
      });

      if (existingUser) {
        throw new ConflictError('A user with this mobile number already exists');
      }

      const employeeCount = await tx.employee.count({ where: { companyId } });
      const employeeCode = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

      const pinHash = await hashPin(input.pin || '1234');
      const user = await tx.user.create({
        data: {
          companyId,
          phone: cleanPhone,
          email: input.email?.toLowerCase(),
          pinHash,
          role: Role.EMPLOYEE,
        },
      });

      const employee = await tx.employee.create({
        data: {
          companyId,
          userId: user.id,
          employeeCode,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfJoining: new Date(input.dateOfJoining),
          branchId: input.branchId,
          departmentId: input.departmentId,
          designationId: input.designationId,
          shiftId: input.shiftId,
          reportingManagerId: input.reportingManagerId,
          salaryStructureId: input.salaryStructureId,
          gender: input.gender,
          emergencyContactName: input.emergencyContactName,
          emergencyContactPhone: input.emergencyContactPhone,
        },
        include: {
          branch: true,
          department: true,
          designation: true,
          shift: true,
        },
      });

      // Seed standard leave balances
      const leaveTypes = await tx.leaveType.findMany({ where: { companyId } });
      const currentYear = new Date().getFullYear();
      for (const lt of leaveTypes) {
        await tx.leaveBalance.create({
          data: {
            employeeId: employee.id,
            leaveTypeId: lt.id,
            year: currentYear,
            totalDays: lt.daysPerYear,
          },
        });
      }

      await logAuditEvent(tx as any, {
        companyId,
        userId: creatorUserId,
        action: 'EMPLOYEE_CREATED',
        resource: 'Employee',
        resourceId: employee.id,
        metadata: { employeeCode, phone: cleanPhone },
      });

      return employee;
    });
  }

  async getDocumentUploadUrl(companyId: string, employeeId: string, documentType: string, mimeType: string) {
    const s3Key = `companies/${companyId}/employees/${employeeId}/${documentType}_${Date.now()}`;
    const presigned = await storageProvider.getPresignedUploadUrl(s3Key, mimeType);
    return presigned;
  }

  async registerEmployeeDocument(
    companyId: string,
    employeeId: string,
    input: { documentType: string; title: string; s3Key: string; bucket: string; mimeType: string }
  ) {
    return withTenantContext(companyId, async (tx) => {
      const doc = await tx.employeeDocument.create({
        data: {
          employeeId,
          documentType: input.documentType,
          title: input.title,
          s3Key: input.s3Key,
          s3Bucket: input.bucket,
          mimeType: input.mimeType,
          status: VerificationStatus.PENDING,
        },
      });
      return doc;
    });
  }
}

export const employeeService = new EmployeeService();