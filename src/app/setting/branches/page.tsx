import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { BranchesView } from "@/components/branches/BranchesView";

export default function SettingBranchesPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading branches...</div>}>
        <BranchesView />
      </Suspense>
    </AdminShell>
  );
}
