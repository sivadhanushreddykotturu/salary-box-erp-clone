import { AdminShell } from "@/components/layout/AdminShell";
import { CurrentPlanDetailsView } from "@/components/billing/CurrentPlanDetailsView";

export default function CurrentPlanDetailsPage() {
  return (
    <AdminShell>
      <CurrentPlanDetailsView />
    </AdminShell>
  );
}
