import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { MyTeamView } from "@/components/my-team/MyTeamView";

export default function MyTeamPage() {
  return (
    <AdminShell>
      <MyTeamView />
    </AdminShell>
  );
}