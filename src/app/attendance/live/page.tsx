import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { LiveAttendanceView } from "@/components/attendance/LiveAttendanceView";

export default function LiveAttendancePage() {
  return (
    <AdminShell>
      <LiveAttendanceView />
    </AdminShell>
  );
}