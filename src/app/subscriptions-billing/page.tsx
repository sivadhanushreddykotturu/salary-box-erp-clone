import { AdminShell } from "@/components/layout/AdminShell";
import { BillingView } from "@/components/billing/BillingView";

export default function SubscriptionsBillingPage() {
  return (
    <AdminShell>
      <BillingView />
    </AdminShell>
  );
}
