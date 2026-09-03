import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { BillingView } from "@/components/billing/BillingView";

export default function BillingPage() {
  return (
    <AdminShell>
      <BillingView />
    </AdminShell>
  );
}