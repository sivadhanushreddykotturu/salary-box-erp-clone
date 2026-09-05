import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { InactiveEmployeesView } from "@/components/settings/InactiveEmployeesView";

export default function InactiveEmployeesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading inactive employees...</div>}>
        <InactiveEmployeesView />
      </Suspense>
    </AdminShell>
  );
}
