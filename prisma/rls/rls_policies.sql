-- =========================================================================
-- PostgreSQL Row-Level Security (RLS) & Immutability Policies
-- Multi-Tenant Defense-in-Depth Isolation for ERP / HRMS SaaS Platform
-- =========================================================================

-- 1. Enable RLS on Tenant-Scoped Tables
ALTER TABLE "Employee" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Employee" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Branch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Branch" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Department" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Designation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Designation" FORCE ROW LEVEL SECURITY;

ALTER TABLE "Shift" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Shift" FORCE ROW LEVEL SECURITY;

ALTER TABLE "AttendanceRule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AttendanceRule" FORCE ROW LEVEL SECURITY;

ALTER TABLE "AttendancePunch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AttendancePunch" FORCE ROW LEVEL SECURITY;

ALTER TABLE "LeaveType" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LeaveType" FORCE ROW LEVEL SECURITY;

ALTER TABLE "SalaryStructure" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SalaryStructure" FORCE ROW LEVEL SECURITY;

ALTER TABLE "PayrollRun" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PayrollRun" FORCE ROW LEVEL SECURITY;

ALTER TABLE "ReimbursementClaim" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReimbursementClaim" FORCE ROW LEVEL SECURITY;

ALTER TABLE "SalaryAdvance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SalaryAdvance" FORCE ROW LEVEL SECURITY;

ALTER TABLE "CRMLead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CRMLead" FORCE ROW LEVEL SECURITY;

ALTER TABLE "CRMCustomer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CRMCustomer" FORCE ROW LEVEL SECURITY;

ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" FORCE ROW LEVEL SECURITY;

-- 2. Tenant Isolation Policies (Fail-Closed: if app.current_tenant_id is NULL or empty, access is 0 rows)
CREATE POLICY employee_tenant_isolation ON "Employee"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY branch_tenant_isolation ON "Branch"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY department_tenant_isolation ON "Department"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY designation_tenant_isolation ON "Designation"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY shift_tenant_isolation ON "Shift"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY attendance_rule_tenant_isolation ON "AttendanceRule"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY leave_type_tenant_isolation ON "LeaveType"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY salary_structure_tenant_isolation ON "SalaryStructure"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY payroll_run_tenant_isolation ON "PayrollRun"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY reimbursement_tenant_isolation ON "ReimbursementClaim"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY advance_tenant_isolation ON "SalaryAdvance"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY crm_lead_tenant_isolation ON "CRMLead"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY crm_customer_tenant_isolation ON "CRMCustomer"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

CREATE POLICY audit_log_tenant_isolation ON "AuditLog"
    FOR ALL
    USING ("companyId" = current_setting('app.current_tenant_id', true))
    WITH CHECK ("companyId" = current_setting('app.current_tenant_id', true));

-- 3. Database-Enforced Immutability for AuditLog
CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $BODY$
BEGIN
    RAISE EXCEPTION 'AuditLog records are append-only and strictly immutable.';
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_log_immutable ON "AuditLog";
CREATE TRIGGER trg_audit_log_immutable
BEFORE UPDATE OR DELETE ON "AuditLog"
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_mutation();