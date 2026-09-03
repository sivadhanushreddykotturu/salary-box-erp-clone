import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { ActivitiesView } from "@/components/crm/ActivitiesView";

export default function ActivitiesPage() {
  return (
    <AdminShell>
      <ActivitiesView />
    </AdminShell>
  );
}