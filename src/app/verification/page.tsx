import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { VerificationView } from "@/components/verification/VerificationView";

export default function VerificationPage() {
  return (
    <AdminShell>
      <VerificationView />
    </AdminShell>
  );
}