import { withTenantContext } from '@/lib/prisma';
import { geoProvider } from '@/providers/geo';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { PunchType, AttendanceStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

// In-memory debounce to prevent rapid double-taps within 5 seconds
const punchDebounceMap = new Map<string, number>();

export interface PunchInput {
  punchType: PunchType;
  latitude?: number;
  longitude?: number;
  deviceInfo?: string;
  mockGpsDetected?: boolean;
  ipAddress?: string;
}

export class AttendanceService {
  async recordPunch(companyId: string, employeeId: string, input: PunchInput) {
    // 1. Debounce guard
    const now = Date.now();
    const lastPunchTime = punchDebounceMap.get(employeeId);
    if (lastPunchTime && now - lastPunchTime < 5000) {
      throw new ValidationError('Duplicate punch request ignored. Please wait a moment.');
    }
    punchDebounceMap.set(employeeId, now);

    return withTenantContext(companyId, async (tx) => {
      // 2. Fetch employee with branch and shift
      const employee = await tx.employee.findUnique({
        where: { id: employeeId },
        include: {
          branch: true,
          shift: true,
        },
      });

      if (!employee || employee.companyId !== companyId) {
        throw new NotFoundError('Employee profile not found');
      }

      // 3. Geofence Verification
      let isWithinGeofence = true;
      let distanceMeters = 0;

      const rule = await tx.attendanceRule.findUnique({ where: { companyId } });

      if (employee.branch && input.latitude && input.longitude) {
        const check = geoProvider.isWithinGeofence(
          { latitude: input.latitude, longitude: input.longitude },
          { latitude: employee.branch.latitude, longitude: employee.branch.longitude },
          employee.branch.radiusMeters
        );
        isWithinGeofence = check.isWithin;
        distanceMeters = check.distanceMeters;

        if (rule?.geofenceMandatory && !isWithinGeofence) {
          throw new ValidationError(
            `Punch rejected: You are ${distanceMeters}m away from branch. Allowed radius is ${employee.branch.radiusMeters}m.`
          );
        }
      }

      if (rule?.preventMockGPS && input.mockGpsDetected) {
        throw new ValidationError('Punch rejected: Mock GPS / Fake Location detected on device.');
      }

      // 4. Record raw punch
      const punch = await tx.attendancePunch.create({
        data: {
          employeeId,
          punchType: input.punchType,
          latitude: input.latitude,
          longitude: input.longitude,
          isWithinGeofence,
          distanceMeters,
          deviceInfo: input.deviceInfo,
          mockGpsDetected: input.mockGpsDetected || false,
          ipAddress: input.ipAddress,
        },
      });

      // 5. Update / Create Daily Attendance Aggregate Record
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let record = await tx.attendanceRecord.findUnique({
        where: {
          employeeId_date: {
            employeeId,
            date: today,
          },
        },
      });

      const punchTime = punch.timestamp;

      if (!record) {
        // Calculate late minutes if shift start time exists
        let lateMinutes = 0;
        let initialStatus: AttendanceStatus = AttendanceStatus.PRESENT;

        if (employee.shift && input.punchType === PunchType.IN) {
          const [shiftHours, shiftMins] = employee.shift.startTime.split(':').map(Number);
          const shiftStartToday = new Date(today);
          shiftStartToday.setHours(shiftHours, shiftMins, 0, 0);

          const diffMins = Math.floor((punchTime.getTime() - shiftStartToday.getTime()) / (1000 * 60));
          if (diffMins > (employee.shift.graceTimeMinutes || 15)) {
            lateMinutes = diffMins;
            initialStatus = AttendanceStatus.LATE;
          }
        }

        record = await tx.attendanceRecord.create({
          data: {
            employeeId,
            date: today,
            firstIn: punchTime,
            lastOut: punchTime,
            status: initialStatus,
            lateMinutes,
            totalWorkMinutes: 0,
          },
        });
      } else {
        // Update firstIn / lastOut and calculate total work minutes
        const updatedFirstIn = record.firstIn || punchTime;
        const updatedLastOut = punchTime;
        const totalMinutes = Math.max(
          0,
          Math.floor((updatedLastOut.getTime() - updatedFirstIn.getTime()) / (1000 * 60))
        );

        let status = record.status;
        if (employee.shift) {
          if (totalMinutes < employee.shift.halfDayMinutes) {
            status = record.lateMinutes > 0 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
          } else {
            status = AttendanceStatus.PRESENT;
          }
        }

        record = await tx.attendanceRecord.update({
          where: { id: record.id },
          data: {
            firstIn: updatedFirstIn,
            lastOut: updatedLastOut,
            totalWorkMinutes: totalMinutes,
            status,
          },
        });
      }

      await logAuditEvent(tx as any, {
        companyId,
        userId: employee.userId,
        action: 'ATTENDANCE_PUNCH',
        resource: 'AttendancePunch',
        resourceId: punch.id,
        metadata: { punchType: input.punchType, isWithinGeofence, distanceMeters },
      });

      return { punch, dailyRecord: record };
    });
  }

  async getLiveAttendance(companyId: string, dateStr?: string, branchId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const targetDate = dateStr ? new Date(dateStr) : new Date();
      targetDate.setHours(0, 0, 0, 0);

      const employees = await tx.employee.findMany({
        where: {
          companyId,
          status: 'ACTIVE',
          ...(branchId ? { branchId } : {}),
        },
        include: {
          branch: true,
          shift: true,
          department: true,
          designation: true,
          attendanceRecords: {
            where: { date: targetDate },
          },
        },
      });

      let presentCount = 0;
      let lateCount = 0;
      let absentCount = 0;
      let halfDayCount = 0;

      const employeeStatusList = employees.map((emp) => {
        const rec = emp.attendanceRecords[0];
        const status = rec ? rec.status : AttendanceStatus.ABSENT;

        if (status === AttendanceStatus.PRESENT) presentCount++;
        else if (status === AttendanceStatus.LATE) lateCount++;
        else if (status === AttendanceStatus.HALF_DAY) halfDayCount++;
        else absentCount++;

        return {
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          name: `${emp.firstName} ${emp.lastName || ''}`.trim(),
          branch: emp.branch?.name,
          department: emp.department?.name,
          firstIn: rec?.firstIn || null,
          lastOut: rec?.lastOut || null,
          totalWorkMinutes: rec?.totalWorkMinutes || 0,
          status,
        };
      });

      return {
        summary: {
          totalEmployees: employees.length,
          presentCount: presentCount + lateCount,
          lateCount,
          halfDayCount,
          absentCount,
        },
        employees: employeeStatusList,
      };
    });
  }

  async getDailyLogs(companyId: string, employeeId: string, month: number, year: number) {
    return withTenantContext(companyId, async (tx) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const records = await tx.attendanceRecord.findMany({
        where: {
          employeeId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      return records;
    });
  }
}

export const attendanceService = new AttendanceService();