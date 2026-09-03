import { withTenantContext } from '@/lib/prisma';

export class ReportService {
  async getAttendanceReport(companyId: string, month: number, year: number) {
    return withTenantContext(companyId, async (tx) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const employees = await tx.employee.findMany({
        where: { companyId },
        include: {
          branch: true,
          department: true,
          attendanceRecords: {
            where: { date: { gte: startDate, lte: endDate } },
          },
        },
      });

      const report = employees.map((emp) => {
        let presentDays = 0;
        let lateDays = 0;
        let halfDays = 0;
        let absentDays = 0;
        let totalMinutes = 0;

        for (const rec of emp.attendanceRecords) {
          totalMinutes += rec.totalWorkMinutes;
          if (rec.status === 'PRESENT') presentDays++;
          else if (rec.status === 'LATE') {
            presentDays++;
            lateDays++;
          } else if (rec.status === 'HALF_DAY') halfDays++;
          else absentDays++;
        }

        return {
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          name: `${emp.firstName} ${emp.lastName || ''}`.trim(),
          branch: emp.branch?.name,
          department: emp.department?.name,
          presentDays,
          lateDays,
          halfDays,
          absentDays,
          totalWorkHours: (totalMinutes / 60).toFixed(1),
        };
      });

      return { month, year, records: report };
    });
  }

  async getPayrollRegisterReport(companyId: string, month: number, year: number) {
    return withTenantContext(companyId, async (tx) => {
      const run = await tx.payrollRun.findUnique({
        where: {
          companyId_month_year: {
            companyId,
            month,
            year,
          },
        },
        include: {
          items: {
            include: {
              employee: {
                include: { department: true, designation: true },
              },
            },
          },
        },
      });

      if (!run) {
        return { month, year, status: 'NOT_GENERATED', items: [] };
      }

      return {
        month,
        year,
        status: run.status,
        summary: {
          totalEmployees: run.totalEmployees,
          totalGrossPay: run.totalGrossPay,
          totalDeductions: run.totalDeductions,
          totalNetPay: run.totalNetPay,
        },
        items: run.items.map((i) => ({
          employeeCode: i.employee.employeeCode,
          name: `${i.employee.firstName} ${i.employee.lastName || ''}`.trim(),
          department: i.employee.department?.name,
          designation: i.employee.designation?.title,
          payableDays: i.payableDays,
          lopDays: i.lopDays,
          basicPay: i.basicPay,
          hra: i.hra,
          allowances: i.allowances,
          grossEarnings: i.grossEarnings,
          pfDeduction: i.pfDeduction,
          esiDeduction: i.esiDeduction,
          professionalTax: i.professionalTax,
          tdsDeduction: i.tdsDeduction,
          advanceEmi: i.advanceEmiDeduction,
          reimbursements: i.reimbursementAmount,
          netSalaryPayable: i.netSalaryPayable,
        })),
      };
    });
  }
}

export const reportService = new ReportService();