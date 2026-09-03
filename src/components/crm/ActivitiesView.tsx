"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";

export function ActivitiesView() {
  const [tasks, setTasks] = useState([
    { id: "1", type: "CALL", title: "Call Mohan Krishna regarding pricing discount", company: "Krishna Valley Transports", time: "Today, 4:00 PM", done: false },
    { id: "2", type: "MEETING", title: "Product demo & branch geofence presentation", company: "Amaravati Cold Storage", time: "Tomorrow, 11:30 AM", done: false },
    { id: "3", type: "FOLLOW_UP", title: "Send revised PDF quotation for 50 licenses", company: "Apex Warehousing", time: "05 Sep 2026", done: true },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <h1 className="text-base font-bold text-slate-800">Follow-ups & Sales Activities</h1>
        <p className="text-xs text-slate-500">Upcoming calls, meetings, and client follow-up schedule</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-xs">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className={`text-xs font-semibold ${task.done ? "line-through text-slate-400" : "text-slate-900"}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-slate-500">{task.company}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{task.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}