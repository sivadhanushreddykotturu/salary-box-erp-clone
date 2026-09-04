import { AdminShell } from "@/components/layout/AdminShell";
import { SettingsView } from "@/components/settings/SettingsView";

export default function SettingsPage() {
  return (
    <AdminShell>
      <SettingsView />
    </AdminShell>
  );
}
