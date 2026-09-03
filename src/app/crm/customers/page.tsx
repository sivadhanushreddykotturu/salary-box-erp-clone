import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { CustomersView } from "@/components/crm/CustomersView";

export default function CustomersPage() {
  return (
    <AdminShell>
      <CustomersView />
    </AdminShell>
  );
}