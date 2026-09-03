import { withTenantContext } from '@/lib/prisma';
import { NotFoundError, ValidationError } from '@/lib/errors';
import { PayrollStatus, AttendanceStatus } from '@prisma/client';
import { logAuditEvent } from '@/lib/audit';

export interface CreateSalaryStructureInput {
  title: string;
  monthlyCtc: number;
  basicSalary: number;
  hra: number;
  specialAllowance?: number;
  conveyance?: number;
  medicalAllowance?: number;
  providentFundEmployee?: number;
  esiEmployee?: number;
  professionalTax?: number;
  tdsMonthly?: number;
}

export class PayrollService {
  async createStructure(companyId: string, input: CreateSalaryStructureInput) {
    return withTenantContext(companyId, async (tx) => {
      return tx.salaryStructure.create({
        data: {
          companyId,
          title: input.title,
          monthlyCtc: input.monthlyCtc,
          basicSalary: input.basicSalary,
          hra: input.hra,
          specialAllowance: input.specialAllowance || 0,
          conveyance: input.conveyance || 0,
          medicalAllowance: input.medicalAllowance || 0,
          providentFundEmployee: input.providentFundEmployee || 0,
          esiEmployee: input.esiEmployee || 0,
          professionalTax: input.professionalTax ?? 200,
          tdsMonthly: input.tdsMonthly || 0,
        },
      });
    });
  }

  async runMonthlyPayroll(companyId: string, month: number, year: number, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      // Days in month
      const daysInMonth = new Date(year, month, 0).getDate();
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Check if run already exists
      const existing = await tx.payrollRun.findUnique({
        where: {
          companyId_month_year: {
            companyId,
            month,
            year,
          },
        },
      });

      if (existing && existing.status === PayrollStatus.FINALIZED) {
        throw new ValidationError(`Payroll for ${month}/${year} is already finalized.`);
      }

      const run =
        existing ||
        (await tx.payrollRun.create({
          data: {
            companyId,
            month,
            year,
            status: PayrollStatus.CALCULATING,
          },
        }));

      // Fetch active employees with structures
      const employees = await tx.employee.findMany({
        where: { companyId, status: 'ACTIVE' },
        include: {
          salaryStructure: true,
          attendanceRecords: {
            where: { date: { gte: startDate, lte: endDate } },
          },
          reimbursements: {
            where: {
              status: 'APPROVED',
              payrollMonth: month,
              payrollYear: year,
            },
          },
          salaryAdvances: {
            where: { status: 'ACTIVE' },
          },
        },
      });

      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;

      // Delete existing draft items
      await tx.payrollItem.deleteMany({ where: { payrollRunId: run.id } });

      for (const emp of employees) {
        const structure = emp.salaryStructure;
        const basicMonthly = structure ? structure.basicSalary : 25000;
        const hraMonthly = structure ? structure.hra : 10000;
        const allowanceMonthly = structure ? structure.specialAllowance + structure.conveyance : 5000;

        // Count attendance
        let presentDays = 0;
        let halfDays = 0;
        let absentDays = 0;

        for (const rec of emp.attendanceRecords) {
          if (rec.status === AttendanceStatus.PRESENT || rec.status === AttendanceStatus.LATE) {
            presentDays++;
          } else if (rec.status === AttendanceStatus.HALF_DAY) {
            halfDays++;
          } else if (rec.status === AttendanceStatus.ABSENT) {
            absentDays++;
          }
        }

        const effectivePresent = presentDays + halfDays * 0.5;
        // Default unrecorded days treated as present for MVP salaried staff or prorated
        const payableDays = Math.min(daysInMonth, effectivePresent > 0 ? effectivePresent : daysInMonth);
        const lopDays = Math.max(0, daysInMonth - payableDays);

        // Prorated Gross
        const prorationFactor = payableDays / daysInMonth;
        const basicPay = Math.round(basicMonthly * prorationFactor);
        const hra = Math.round(hraMonthly * prorationFactor);
        const allowances = Math.round(allowanceMonthly * prorationFactor);
        const grossEarnings = basicPay + hra + allowances;

        // Deductions
        const pf = structure ? structure.providentFundEmployee : Math.round(basicPay * 0.12);
        const esi = structure ? structure.esiEmployee : grossEarnings <= 21000 ? Math.round(grossEarnings * 0.0075) : 0;
        const pt = structure ? structure.professionalTax : 200;
        const tds = structure ? structure.tdsMonthly : 0;

        // Advance recovery
        let emiDeduction = 0;
        if (emp.salaryAdvances.length > 0) {
          emiDeduction = emp.salaryAdvances[0].monthlyEmi;
        }

        // Approved Reimbursements
        const reimbursementAmount = emp.reimbursements.reduce((acc, curr) => acc + curr.amount, 0);

        const deductions = pf + esi + pt + tds + emiDeduction;
        const netSalaryPayable = grossEarnings - deductions + reimbursementAmount;

        totalGross += grossEarnings;
        totalDeductions += deductions;
        totalNet += netSalaryPayable;

        await tx.payrollItem.create({
          data: {
            payrollRunId: run.id,
            employeeId: emp.id,
            totalDaysInMonth: daysInMonth,
            payableDays,
            lopDays,
            basicPay,
            hra,
            allowances,
            grossEarnings,
            pfDeduction: pf,
            esiDeduction: esi,
            professionalTax: pt,
            tdsDeduction: tds,
            advanceEmiDeduction: emiDeduction,
            totalDeductions: deductions,
            reimbursementAmount,
            netSalaryPayable,
          },
        });
      }

      const finalizedRun = await tx.payrollRun.update({
        where: { id: run.id },
        data: {
          totalEmployees: employees.length,
          totalGrossPay: totalGross,
          totalDeductions,
          totalNetPay: totalNet,
          status: PayrollStatus.DRAFT,
        },
        include: { items: { include: { employee: true } } },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'PAYROLL_CALCULATED',
        resource: 'PayrollRun',
        resourceId: run.id,
        metadata: { month, year, totalNet },
      });

      return finalizedRun;
    });
  }

  async finalizePayroll(companyId: string, payrollRunId: string, userId?: string) {
    return withTenantContext(companyId, async (tx) => {
      const run = await tx.payrollRun.findUnique({ where: { id: payrollRunId } });
      if (!run || run.companyId !== companyId) {
        throw new NotFoundError('Payroll run not found');
      }

      const updated = await tx.payrollRun.update({
        where: { id: payrollRunId },
        data: {
          status: PayrollStatus.FINALIZED,
          finalizedAt: new Date(),
        },
      });

      await logAuditEvent(tx as any, {
        companyId,
        userId,
        action: 'PAYROLL_FINALIZED',
        resource: 'PayrollRun',
        resourceId: payrollRunId,
      });

      return updated;
    });
  }
}

export const payrollService = new PayrollService();