import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { EmployeesManagersView } from "@/components/settings/EmployeesManagersView";

export default function SettingRolesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading staff roles...</div>}>
        <EmployeesManagersView />
      </Suspense>
    </AdminShell>
  );
}
