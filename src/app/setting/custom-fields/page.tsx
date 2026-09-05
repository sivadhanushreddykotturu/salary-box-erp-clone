import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { CustomFieldsView } from "@/components/settings/CustomFieldsView";

export default function SettingCustomFieldsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading custom fields...</div>}>
        <CustomFieldsView />
      </Suspense>
    </AdminShell>
  );
}
