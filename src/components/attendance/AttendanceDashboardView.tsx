"use client";

import React, { useState } from "react";
import { Filter, Search, ChevronDown, Download, Upload, ArrowUpDown } from "lucide-react";

interface MonthlyDashboardItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  phone: string;
  employeeId: string;
  jobTitle: string;
  present: number;
  absent: number;
  halfDay: number;
  weekOff: number;
  holiday: number;
}

const DASHBOARD_STAFF: MonthlyDashboardItem[] = [
  { id: "1", name: "Anil", initials: "A", avatarColor: "bg-blue-500", phone: "9989110795", employeeId: "-", jobTitle: "-", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "2", name: "Bobba Prasad", initials: "BP", avatarColor: "bg-purple-600", phone: "9052306037", employeeId: "-", jobTitle: "Technician", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "3", name: "DARA DEEKSHITH", initials: "DD", avatarColor: "bg-teal-600", phone: "8977273619", employeeId: "-", jobTitle: "-", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "4", name: "Durga Prasad Carg...", initials: "DC", avatarColor: "bg-emerald-600", phone: "9247900633", employeeId: "-", jobTitle: "-", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "5", name: "Medipalli Nanibabu", initials: "MN", avatarColor: "bg-indigo-600", phone: "7671831009", employeeId: "-", jobTitle: "Trainee Tech...", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "6", name: "Priyanka EDP RSS ...", initials: "PV", avatarColor: "bg-pink-600", phone: "8121920952", employeeId: "-", jobTitle: "-", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "7", name: "Rajesh Service Man...", initials: "RV", avatarColor: "bg-amber-600", phone: "9247900637", employeeId: "-", jobTitle: "Service Man...", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "8", name: "Saleem", initials: "S", avatarColor: "bg-purple-700", phone: "7396079141", employeeId: "-", jobTitle: "-", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
  { id: "9", name: "Shaaru", initials: "S", avatarColor: "bg-violet-600", phone: "8179334404", employeeId: "-", jobTitle: "Technician", present: 0, absent: 3, halfDay: 0, weekOff: 0, holiday: 0 },
];

export function AttendanceDashboardView() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const filteredStaff = DASHBOARD_STAFF.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">Attendance Dashboard</h1>
      </div>

      {/* 2. Two-Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Filter Sidebar matching Screenshot 3 */}
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
                setSearchTerm("");
              }}
              className="text-xs font-semibold text-[#007BFF] hover:underline"
            >
              Reset
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Month</label>
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
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date of Leaving</label>
            <input
              type="date"
              className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date of Joining</label>
            <input
              type="date"
              className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Show Inactive Staff</span>
            </label>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-4 flex flex-col space-y-4">
          {/* Top Bar matching Screenshot 3 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff by Name or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-semibold text-slate-700 mr-2">Showing {filteredStaff.length} staff</span>

              <button
                onClick={() => alert("Import Attendance modal")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Attendance</span>
              </button>

              <button
                onClick={() => alert("Downloading Monthly Report...")}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Table matching Screenshot 3 */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Job Title</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Present</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Absent</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Half Day</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span>Week Off</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Holiday</th>
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
                    <td className="px-4 py-3 font-mono text-slate-600">{staff.phone}</td>
                    <td className="px-4 py-3 text-slate-500">{staff.employeeId}</td>
                    <td className="px-4 py-3 text-slate-600">{staff.jobTitle}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{staff.present}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700">{staff.absent}</td>
                    <td className="px-4 py-3 text-slate-500">{staff.halfDay}</td>
                    <td className="px-4 py-3 text-slate-500">{staff.weekOff}</td>
                    <td className="px-4 py-3 text-slate-500">{staff.holiday}</td>
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