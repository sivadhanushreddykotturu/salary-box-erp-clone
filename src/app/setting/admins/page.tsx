import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminsView } from "@/components/settings/AdminsView";

export default function SettingAdminsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading admins...</div>}>
        <AdminsView />
      </Suspense>
    </AdminShell>
  );
}
