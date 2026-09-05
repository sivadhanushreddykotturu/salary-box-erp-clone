import { AdminShell } from "@/components/layout/AdminShell";
import { DepartmentsView } from "@/components/departments/DepartmentsView";

export default function DepartmentsPage() {
  return (
    <AdminShell>
      <DepartmentsView />
    </AdminShell>
  );
}
