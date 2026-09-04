import { AdminShell } from "@/components/layout/AdminShell";
import { PlanHistoryView } from "@/components/billing/PlanHistoryView";

export default function PlanHistoryPage() {
  return (
    <AdminShell>
      <PlanHistoryView />
    </AdminShell>
  );
}
