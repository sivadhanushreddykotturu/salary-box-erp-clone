import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { LocationTrackingView } from "@/components/location/LocationTrackingView";

export default function LocationPage() {
  return (
    <AdminShell>
      <LocationTrackingView />
    </AdminShell>
  );
}