import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { CrmPipelineView } from "@/components/crm/CrmPipelineView";

export default function LeadsPage() {
  return (
    <AdminShell>
      <CrmPipelineView />
    </AdminShell>
  );
}