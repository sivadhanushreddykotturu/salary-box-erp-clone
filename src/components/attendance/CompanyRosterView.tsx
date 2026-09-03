"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, Upload, Check } from "lucide-react";

export function CompanyRosterView() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [selectedDays, setSelectedDays] = useState<number[]>([1]);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Calendar cells for Sep 2026 (starts on Tuesday)
  const calendarCells = [
    { day: 30, isPrev: true },
    { day: 31, isPrev: true },
    { day: 1, isCurrent: true, label: "1 Sep" },
    { day: 2, isCurrent: true },
    { day: 3, isCurrent: true },
    { day: 4, isCurrent: true },
    { day: 5, isCurrent: true },
    { day: 6, isCurrent: true },
    { day: 7, isCurrent: true },
    { day: 8, isCurrent: true },
    { day: 9, isCurrent: true },
    { day: 10, isCurrent: true },
    { day: 11, isCurrent: true },
    { day: 12, isCurrent: true },
    { day: 13, isCurrent: true },
    { day: 14, isCurrent: true },
    { day: 15, isCurrent: true },
    { day: 16, isCurrent: true },
    { day: 17, isCurrent: true },
    { day: 18, isCurrent: true },
    { day: 19, isCurrent: true },
    { day: 20, isCurrent: true },
    { day: 21, isCurrent: true },
    { day: 22, isCurrent: true },
    { day: 23, isCurrent: true },
    { day: 24, isCurrent: true },
    { day: 25, isCurrent: true },
    { day: 26, isCurrent: true },
    { day: 27, isCurrent: true },
    { day: 28, isCurrent: true },
    { day: 29, isCurrent: true },
    { day: 30, isCurrent: true },
    { day: 1, isNext: true, label: "1 Oct" },
    { day: 2, isNext: true },
    { day: 3, isNext: true },
    { day: 4, isNext: true },
    { day: 5, isNext: true },
    { day: 6, isNext: true },
    { day: 7, isNext: true },
    { day: 8, isNext: true },
    { day: 9, isNext: true },
    { day: 10, isNext: true },
  ];

  const toggleDay = (dayNum: number) => {
    if (selectedDays.includes(dayNum)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayNum));
    } else {
      setSelectedDays([...selectedDays, dayNum]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">Company Roster</h1>
      </div>

      {/* 2. Two-Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Filter Sidebar matching Screenshot 4 */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 space-y-4 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => {
                setSelectedBranch("All Branches");
                setSelectedDept("All Departments");
                setSelectedShift("All Shifts");
                setSelectedDays([1]);
              }}
              className="text-xs font-semibold text-[#007BFF] hover:underline"
            >
              Reset
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Select Date</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Select Branch</label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Branches</option>
                <option>HQ Bangalore</option>
                <option>Vijayawada Office</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Select Department</label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Departments</option>
                <option>Operations</option>
                <option>Technicians</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Select Shift</label>
            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option>All Shifts</option>
                <option>General Day Shift (9 AM - 6 PM)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Content Area matching Screenshot 4 */}
        <div className="flex-1 p-4 flex flex-col space-y-4">
          {/* Top Button & Assign Legend */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Select Dates to assign roster
            </div>

            <button
              onClick={() => alert("Import Roster modal")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Roster</span>
            </button>
          </div>

          {/* Calendar Grid matching Screenshot 4 */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-[#FAFBFD] text-center text-xs font-semibold text-slate-700 py-2.5">
              {daysOfWeek.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 text-xs">
              {calendarCells.map((cell, idx) => {
                const isSelected = cell.isCurrent && selectedDays.includes(cell.day);

                return (
                  <div
                    key={idx}
                    onClick={() => cell.isCurrent && toggleDay(cell.day)}
                    className={`h-20 p-2.5 flex flex-col justify-between transition-colors cursor-pointer ${
                      cell.isPrev || cell.isNext
                        ? "bg-slate-50/50 text-slate-300"
                        : isSelected
                        ? "bg-blue-50/60 text-slate-900 font-semibold"
                        : "hover:bg-slate-50/80 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {cell.isCurrent && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                      <span>{cell.label || cell.day}</span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] text-blue-600 font-medium bg-blue-100/60 px-1.5 py-0.5 rounded w-fit">
                        General Shift
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}