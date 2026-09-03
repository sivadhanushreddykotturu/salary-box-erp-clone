import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { DownloadReportsView } from "@/components/reports/DownloadReportsView";

export default function DownloadReportsPage() {
  return (
    <AdminShell>
      <DownloadReportsView />
    </AdminShell>
  );
}