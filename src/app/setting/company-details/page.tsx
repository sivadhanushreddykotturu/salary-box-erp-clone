import { AdminShell } from "@/components/layout/AdminShell";
import { AddEditCompanyView } from "@/components/settings/AddEditCompanyView";

export default function SettingCompanyDetailsPage() {
  return (
    <AdminShell>
      <AddEditCompanyView />
    </AdminShell>
  );
}
