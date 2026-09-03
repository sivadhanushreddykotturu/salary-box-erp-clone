import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { CompanyRosterView } from "@/components/attendance/CompanyRosterView";

export default function CompanyRosterPage() {
  return (
    <AdminShell>
      <CompanyRosterView />
    </AdminShell>
  );
}