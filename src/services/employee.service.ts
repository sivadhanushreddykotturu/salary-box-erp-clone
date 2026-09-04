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

  async createBulkEmployees(companyId: string, employees: any[], creatorUserId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const createdList: any[] = [];
      const currentYear = new Date().getFullYear();
      const leaveTypes = await tx.leaveType.findMany({ where: { companyId } });
      const pinHash = await hashPin('1234');

      for (let i = 0; i < employees.length; i++) {
        const item = employees[i];
        if (!item.name || !item.phone) continue; // Mandatory checks

        const cleanPhone = String(item.phone).replace(/\D/g, '');
        if (!cleanPhone) continue;

        // Check if user exists
        let user = await tx.user.findFirst({ where: { phone: cleanPhone } });
        if (!user) {
          user = await tx.user.create({
            data: {
              companyId,
              phone: cleanPhone,
              email: item.personalEmail?.toLowerCase() || item.officialEmail?.toLowerCase(),
              pinHash,
              role: Role.EMPLOYEE,
            },
          });
        }

        const count = await tx.employee.count({ where: { companyId } });
        const employeeCode = item.employeeCode || `EMP${String(count + 1).padStart(3, '0')}`;

        const nameParts = item.name.trim().split(' ');
        const firstName = nameParts[0] || item.name;
        const lastName = nameParts.slice(1).join(' ') || undefined;

        // Resolve branch / department if names provided
        let branchId = item.branchId;
        if (!branchId && item.branchName) {
          const branch = await tx.branch.findFirst({ where: { companyId, name: item.branchName } });
          if (branch) branchId = branch.id;
        }

        let departmentId = item.departmentId;
        if (!departmentId && item.departmentName) {
          const dept = await tx.department.findFirst({ where: { companyId, name: item.departmentName } });
          if (dept) departmentId = dept.id;
        }

        let employee = await tx.employee.findFirst({
          where: { companyId, userId: user.id },
        });

        if (!employee) {
          employee = await tx.employee.create({
            data: {
              companyId,
              userId: user.id,
              employeeCode,
              firstName,
              lastName,
              jobTitle: item.jobTitle || 'Executive',
              employeeType: item.employeeType || 'Full Time',
              dateOfJoining: item.dateOfJoining ? new Date(item.dateOfJoining) : new Date(),
              dob: item.dob ? new Date(item.dob) : undefined,
              gender: item.gender || 'Male',
              maritalStatus: item.maritalStatus,
              bloodGroup: item.bloodGroup,
              mobileNumber: cleanPhone,
              personalEmail: item.personalEmail,
              officialEmail: item.officialEmail,
              currentAddress: item.currentAddress,
              permanentAddress: item.permanentAddress,
              guardianName: item.guardianName,
              emergencyContactName: item.emergencyContactName,
              emergencyContactPhone: item.emergencyContactPhone,
              emergencyContactRelationship: item.emergencyContactRelationship,
              emergencyContactAddress: item.emergencyContactAddress,
              bankName: item.bankName,
              bankAccountNumber: item.bankAccountNumber,
              ifscCode: item.ifscCode,
              accountHolderName: item.accountHolderName,
              branchId,
              departmentId,
            },
          });

          // Create KYC record
          if (item.aadhaarNumber || item.panNumber || item.bankAccountNumber || item.uanNumber) {
            await tx.employeeKYC.create({
              data: {
                employeeId: employee.id,
                aadhaarNumber: item.aadhaarNumber,
                panNumber: item.panNumber,
                bankAccountNumber: item.bankAccountNumber,
                ifscCode: item.ifscCode,
                bankAccountName: item.accountHolderName,
                uanNumber: item.uanNumber,
                pfNumber: item.pfNumber,
                esiNumber: item.esiNumber,
              },
            });
          }

          // Seed leave balances
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
        }

        createdList.push(employee);
      }

      await logAuditEvent(tx as any, {
        companyId,
        userId: creatorUserId,
        action: 'EMPLOYEES_BULK_IMPORTED',
        resource: 'Employee',
        metadata: { importedCount: createdList.length },
      });

      return {
        importedCount: createdList.length,
        employees: createdList,
      };
    });
  }
}

export const employeeService = new EmployeeService();