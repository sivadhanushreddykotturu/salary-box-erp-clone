import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { DailyAttendanceView } from "@/components/attendance/DailyAttendanceView";

export default function DailyAttendancePage() {
  return (
    <AdminShell>
      <DailyAttendanceView />
    </AdminShell>
  );
}