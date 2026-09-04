import { AdminShell } from "@/components/layout/AdminShell";
import { PlanHistoryView } from "@/components/billing/PlanHistoryView";

export default function VipHistoryPage() {
  return (
    <AdminShell>
      <PlanHistoryView />
    </AdminShell>
  );
}
