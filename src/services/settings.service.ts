import { withTenantContext } from '@/lib/prisma';
import { logAuditEvent } from '@/lib/audit';
import { NotFoundError } from '@/lib/errors';

export interface CompanySettingsPayload {
  // Attendance Settings
  attendanceSettings?: {
    aiFaceRecognition?: boolean;
    deviceVerification?: boolean;
    livenessDetection?: boolean;
    blockFakeGps?: boolean;
    autoLiveTrack?: boolean;
    gpsRadiusMeters?: number;
  };
  // Salary Settings
  salarySettings?: {
    calculationType?: 'CALENDAR_MONTH' | '30_DAYS' | '26_DAYS';
    includeWeekoffs?: boolean;
    includeHolidays?: boolean;
    cycleStartDate?: number;
    cycleEndDate?: string;
    roundOffTotalSalary?: boolean;
    autoCalculateTds?: boolean;
  };
  // Alert & Notifications
  alertSettings?: {
    appNotifications?: boolean;
  };
  // Other Settings
  otherSettings?: {
    supportTicketVisibility?: boolean; // true = see all tickets, false = self only
  };
}

export class SettingsService {
  async getSettings(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        include: {
          branches: true,
          departments: true,
          shifts: true,
          leaveTypes: true,
          _count: {
            select: {
              employees: true,
              users: true,
            },
          },
        },
      });

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      // Merge stored settings with default fallbacks
      const storedSettings = (company.settings as Record<string, any>) || {};

      return {
        company: {
          id: company.id,
          name: company.name,
          companyCode: company.companyCode,
          businessEmail: company.businessEmail,
          phone: company.phone,
          gstin: company.gstin,
          address: company.address,
          city: company.city,
          state: company.state,
          pincode: company.pincode,
          logo: company.logo,
          businessType: company.businessType,
          udyamNumber: company.udyamNumber,
          status: company.status,
          branchesCount: company.branches.length,
          departmentsCount: company.departments.length,
          employeesCount: company._count.employees,
        },
        settings: {
          attendanceSettings: {
            aiFaceRecognition: storedSettings.attendanceSettings?.aiFaceRecognition ?? true,
            deviceVerification: storedSettings.attendanceSettings?.deviceVerification ?? true,
            livenessDetection: storedSettings.attendanceSettings?.livenessDetection ?? false,
            blockFakeGps: storedSettings.attendanceSettings?.blockFakeGps ?? true,
            autoLiveTrack: storedSettings.attendanceSettings?.autoLiveTrack ?? false,
            gpsRadiusMeters: storedSettings.attendanceSettings?.gpsRadiusMeters ?? 100,
          },
          salarySettings: {
            calculationType: storedSettings.salarySettings?.calculationType ?? 'CALENDAR_MONTH',
            includeWeekoffs: storedSettings.salarySettings?.includeWeekoffs ?? false,
            includeHolidays: storedSettings.salarySettings?.includeHolidays ?? false,
            cycleStartDate: storedSettings.salarySettings?.cycleStartDate ?? 1,
            cycleEndDate: storedSettings.salarySettings?.cycleEndDate ?? 'END_OF_MONTH',
            roundOffTotalSalary: storedSettings.salarySettings?.roundOffTotalSalary ?? false,
            autoCalculateTds: storedSettings.salarySettings?.autoCalculateTds ?? true,
          },
          alertSettings: {
            appNotifications: storedSettings.alertSettings?.appNotifications ?? true,
          },
          otherSettings: {
            supportTicketVisibility: storedSettings.otherSettings?.supportTicketVisibility ?? true,
          },
        },
      };
    });
  }

  async updateSettings(
    companyId: string,
    payload: {
      settings?: CompanySettingsPayload;
      companyDetails?: {
        name?: string;
        phone?: string;
        gstin?: string;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        logo?: string;
        businessType?: string;
        udyamNumber?: string;
      };
    },
    userId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      const existingSettings = (company.settings as Record<string, any>) || {};
      const newSettings = {
        ...existingSettings,
        ...payload.settings,
        attendanceSettings: {
          ...(existingSettings.attendanceSettings || {}),
          ...(payload.settings?.attendanceSettings || {}),
        },
        salarySettings: {
          ...(existingSettings.salarySettings || {}),
          ...(payload.settings?.salarySettings || {}),
        },
        alertSettings: {
          ...(existingSettings.alertSettings || {}),
          ...(payload.settings?.alertSettings || {}),
        },
        otherSettings: {
          ...(existingSettings.otherSettings || {}),
          ...(payload.settings?.otherSettings || {}),
        },
      };

      const updateData: any = {
        settings: newSettings,
      };

      if (payload.companyDetails) {
        if (payload.companyDetails.name) updateData.name = payload.companyDetails.name;
        if (payload.companyDetails.phone !== undefined) updateData.phone = payload.companyDetails.phone;
        if (payload.companyDetails.gstin !== undefined) updateData.gstin = payload.companyDetails.gstin;
        if (payload.companyDetails.address !== undefined) updateData.address = payload.companyDetails.address;
        if (payload.companyDetails.city !== undefined) updateData.city = payload.companyDetails.city;
        if (payload.companyDetails.state !== undefined) updateData.state = payload.companyDetails.state;
        if (payload.companyDetails.pincode !== undefined) updateData.pincode = payload.companyDetails.pincode;
        if (payload.companyDetails.logo !== undefined) updateData.logo = payload.companyDetails.logo;
        if (payload.companyDetails.businessType !== undefined) updateData.businessType = payload.companyDetails.businessType;
        if (payload.companyDetails.udyamNumber !== undefined) updateData.udyamNumber = payload.companyDetails.udyamNumber;
      }

      const updated = await tx.company.update({
        where: { id: companyId },
        data: updateData,
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'SETTINGS_UPDATED',
        resource: 'Company',
        resourceId: companyId,
        metadata: { updatedFields: Object.keys(payload) },
      });

      return {
        success: true,
        company: updated,
        settings: newSettings,
      };
    });
  }

  async getCustomFields(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { settings: true },
      });

      if (!company) throw new NotFoundError('Company not found');
      const settings = (company.settings as Record<string, any>) || {};
      return settings.customFields || [];
    });
  }

  async addCustomField(companyId: string, name: string, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { settings: true },
      });

      if (!company) throw new NotFoundError('Company not found');
      const settings = (company.settings as Record<string, any>) || {};
      const currentFields = Array.isArray(settings.customFields) ? settings.customFields : [];

      const newField = {
        id: `cf_${Date.now()}`,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      const updatedSettings = {
        ...settings,
        customFields: [...currentFields, newField],
      };

      await tx.company.update({
        where: { id: companyId },
        data: { settings: updatedSettings },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'CUSTOM_FIELD_CREATED',
        resource: 'Company',
        resourceId: companyId,
        metadata: { field: newField },
      });

      return newField;
    });
  }

  async deleteCustomField(companyId: string, fieldId: string, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { settings: true },
      });

      if (!company) throw new NotFoundError('Company not found');
      const settings = (company.settings as Record<string, any>) || {};
      const currentFields = Array.isArray(settings.customFields) ? settings.customFields : [];

      const updatedFields = currentFields.filter((f: any) => f.id !== fieldId);

      const updatedSettings = {
        ...settings,
        customFields: updatedFields,
      };

      await tx.company.update({
        where: { id: companyId },
        data: { settings: updatedSettings },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'CUSTOM_FIELD_DELETED',
        resource: 'Company',
        resourceId: companyId,
        metadata: { fieldId },
      });

      return { success: true };
    });
  }

  async getEmployeeIdConfig(companyId: string) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { settings: true },
      });

      if (!company) throw new NotFoundError('Company not found');
      const settings = (company.settings as Record<string, any>) || {};
      const config = settings.employeeIdConfig || {
        autoAssign: true,
        prefix: '',
        nextNumber: 1,
        digitsInNumber: 0,
      };

      return config;
    });
  }

  async updateEmployeeIdConfig(
    companyId: string,
    payload: {
      autoAssign: boolean;
      prefix?: string;
      nextNumber?: number;
      digitsInNumber?: number;
    },
    userId?: string
  ) {
    return withTenantContext(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
        select: { settings: true },
      });

      if (!company) throw new NotFoundError('Company not found');
      const settings = (company.settings as Record<string, any>) || {};

      const newConfig = {
        autoAssign: payload.autoAssign,
        prefix: payload.prefix ?? '',
        nextNumber: payload.nextNumber ?? 1,
        digitsInNumber: Math.min(10, Math.max(0, payload.digitsInNumber ?? 0)),
      };

      const updatedSettings = {
        ...settings,
        employeeIdConfig: newConfig,
      };

      await tx.company.update({
        where: { id: companyId },
        data: { settings: updatedSettings },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'EMPLOYEE_ID_CONFIG_UPDATED',
        resource: 'Company',
        resourceId: companyId,
        metadata: { config: newConfig },
      });

      return newConfig;
    });
  }
}

export const settingsService = new SettingsService();
