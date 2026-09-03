import cron from 'node-cron';
import { prisma, withoutTenantContext } from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';

export class SchedulerService {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    console.info('[SCHEDULER] 🕒 Initializing in-process node-cron tasks...');

    // 1. Shift End Auto-Checkout & Absence Marker at 23:59 Daily
    cron.schedule('59 23 * * *', async () => {
      console.info('[CRON] Running daily auto-checkout & absence marking job...');
      try {
        await withoutTenantContext(async (tx) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const activeEmployees = await tx.employee.findMany({
            where: { status: 'ACTIVE' },
            include: { attendanceRecords: { where: { date: today } } },
          });

          for (const emp of activeEmployees) {
            if (emp.attendanceRecords.length === 0) {
              // Mark absent
              await tx.attendanceRecord.create({
                data: {
                  employeeId: emp.id,
                  date: today,
                  status: AttendanceStatus.ABSENT,
                },
              });
            }
          }
        });
        console.info('[CRON] Daily auto-checkout job completed.');
      } catch (error) {
        console.error('[CRON_ERROR] Daily auto-checkout error:', error);
      }
    });

    console.info('[SCHEDULER] ✅ Schedulers active.');
  }
}