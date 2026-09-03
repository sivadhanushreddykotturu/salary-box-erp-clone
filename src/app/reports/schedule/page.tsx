"use client";

import React from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Calendar, Plus } from "lucide-react";

export default function ScheduleReportsPage() {
  return (
    <AdminShell>
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-base font-bold text-slate-800">Schedule Recurring Reports</h1>
            <p className="text-xs text-slate-500">Automatically generate and email daily/monthly attendance & payroll digests</p>
          </div>
          <button
            onClick={() => alert("Create Schedule modal")}
            className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Schedule</span>
          </button>
        </div>

        <div className="py-20 text-center text-xs text-slate-400">
          No automated report schedules configured yet. Click "Create Schedule" above.
        </div>
      </div>
    </AdminShell>
  );
}