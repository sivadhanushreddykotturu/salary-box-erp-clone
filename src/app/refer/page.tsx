import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { ReferView } from "@/components/refer/ReferView";

export default function ReferPage() {
  return (
    <AdminShell>
      <ReferView />
    </AdminShell>
  );
}