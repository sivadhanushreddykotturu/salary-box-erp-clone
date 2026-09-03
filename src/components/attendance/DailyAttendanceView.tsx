"use client";

import React, { useState } from "react";
import { Filter, Search, ChevronDown, Download, LayoutGrid, ArrowUpDown } from "lucide-react";

interface DailyStaffItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  firstIn?: string;
  lastOut?: string;
  hoursWorked?: string;
  status: "Present" | "Absent" | "Half day";
}

const DAILY_STAFF_DATA: DailyStaffItem[] = [
  { id: "1", name: "Anil", initials: "A", avatarColor: "bg-blue-500", firstIn: "-", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "2", name: "Bobba Prasad", initials: "BP", avatarColor: "bg-purple-600", firstIn: "08:56 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "3", name: "DARA DEEKSHITH", initials: "DD", avatarColor: "bg-teal-600", firstIn: "10:39 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "4", name: "Durga Prasad Cargo CUG", initials: "DC", avatarColor: "bg-emerald-600", firstIn: "10:52 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "5", name: "Medipalli Nanibabu", initials: "MN", avatarColor: "bg-indigo-600", firstIn: "10:37 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "6", name: "Priyanka EDP RSS VJA", initials: "PV", avatarColor: "bg-pink-600", firstIn: "09:39 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "7", name: "Rajesh Service Manager CUG OSM VJA", initials: "RV", avatarColor: "bg-amber-600", firstIn: "09:36 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
  { id: "8", name: "Saleem", initials: "S", avatarColor: "bg-purple-700", firstIn: "10:35 AM", lastOut: "-", hoursWorked: "-", status: "Absent" },
];

export function DailyAttendanceView() {
  const [selectedDate, setSelectedDate] = useState("2026-09-03");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Absent");

  const summaryPills = [
    { label: "Present", count: 0 },
    { label: "Absent", count: 9 },
    { label: "Half day", count: 0 },
  ];

  const handleReset = () => {
    setSelectedBranch("All Branches");
    setSelectedDept("All Departments");
    setSelectedShift("All Shifts");
    setSearchTerm("");
  };

  const filteredStaff = DAILY_STAFF_DATA.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">Daily Attendance</h1>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Filter Sidebar matching Screenshot 2 */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 space-y-4 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
            </div>
            <button onClick={handleReset} className="text-xs font-semibold text-[#007BFF] hover:underline">
              Reset
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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

        {/* Right Content Area */}
        <div className="flex-1 p-4 flex flex-col space-y-4">
          {/* Top Bar matching Screenshot 2 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {summaryPills.map((pill) => (
                <button
                  key={pill.label}
                  onClick={() => setActiveFilter(pill.label)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    activeFilter === pill.label
                      ? "bg-[#EBF5FF] text-[#007BFF] border-blue-300 font-semibold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pill.label} ({pill.count})
                </button>
              ))}

              <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50">
                <span>More</span>
                <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            <button
              onClick={() => alert("Downloading Daily Attendance Report...")}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs self-end sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Staff"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-semibold text-slate-700">Showing {filteredStaff.length} staff</span>
          </div>

          {/* Table matching Screenshot 2 */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Staff</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">First In</th>
                  <th className="px-4 py-3">Last Out</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Hours Worked</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${staff.avatarColor}`}
                        >
                          {staff.initials}
                        </div>
                        <span className="font-medium text-[#007BFF] hover:underline cursor-pointer">
                          {staff.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{staff.firstIn}</td>
                    <td className="px-4 py-3 text-slate-600">{staff.lastOut}</td>
                    <td className="px-4 py-3 text-slate-600">{staff.hoursWorked}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}