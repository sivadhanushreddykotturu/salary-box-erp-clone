import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AttendanceDashboardView } from "@/components/attendance/AttendanceDashboardView";

export default function AttendanceDashboardPage() {
  return (
    <AdminShell>
      <AttendanceDashboardView />
    </AdminShell>
  );
}