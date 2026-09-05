import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { EmployeeIdConfigView } from "@/components/settings/EmployeeIdConfigView";

export default function SettingAutoEmployeeIdPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading employee ID configuration...</div>}>
        <EmployeeIdConfigView />
      </Suspense>
    </AdminShell>
  );
}
