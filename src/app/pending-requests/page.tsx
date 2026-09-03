import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { PendingRequestsView } from "@/components/pending-requests/PendingRequestsView";

export default function PendingRequestsPage() {
  return (
    <AdminShell>
      <PendingRequestsView />
    </AdminShell>
  );
}