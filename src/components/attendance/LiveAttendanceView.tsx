"use client";

import React, { useState } from "react";
import { Filter, Search, ChevronDown, MapPin, Clock } from "lucide-react";

interface LiveStaffItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  address?: string;
  status: "In" | "Out" | "No Punch In" | "Break" | "Late" | "Early Leaving";
  punchTime?: string;
}

const LIVE_STAFF_DATA: LiveStaffItem[] = [
  {
    id: "1",
    name: "Anil",
    initials: "A",
    avatarColor: "bg-blue-500",
    status: "No Punch In",
  },
  {
    id: "2",
    name: "Bobba Prasad",
    initials: "BP",
    avatarColor: "bg-purple-600",
    address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "08:56 AM",
  },
  {
    id: "3",
    name: "DARA DEEKSHITH",
    initials: "DD",
    avatarColor: "bg-teal-600",
    address: "Lakshmi subbarao sai kavya Building, Block XIII, TDP OFFICE, P48 54-10-21 C, Dist, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "10:39 AM",
  },
  {
    id: "4",
    name: "Durga Prasad Cargo CUG",
    initials: "DC",
    avatarColor: "bg-emerald-600",
    address: "Lakshmi subbarao sai kavya Building, Block XIII, TDP OFFICE, P48 54-10-21 C, Dist, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "10:52 AM",
  },
  {
    id: "5",
    name: "Medipalli Nanibabu",
    initials: "MN",
    avatarColor: "bg-indigo-600",
    address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "10:37 AM",
  },
  {
    id: "6",
    name: "Priyanka EDP RSS VJA",
    initials: "PV",
    avatarColor: "bg-pink-600",
    address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "09:39 AM",
  },
  {
    id: "7",
    name: "Rajesh Service Manager CUG OSM VJA",
    initials: "RV",
    avatarColor: "bg-amber-600",
    address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
    status: "In",
    punchTime: "09:36 AM",
  },
];

export function LiveAttendanceView() {
  const [activeFilter, setActiveFilter] = useState<string>("In");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedShift, setSelectedShift] = useState("All Shifts");

  const statusPills = [
    { label: "In", count: 8 },
    { label: "Out", count: 0 },
    { label: "No Punch In", count: 1 },
    { label: "Break", count: 0 },
    { label: "Late", count: 5 },
    { label: "Early Leaving", count: 0 },
  ];

  const filteredStaff = LIVE_STAFF_DATA.filter((staff) => {
    if (activeFilter === "In") return staff.status === "In";
    if (activeFilter === "No Punch In") return staff.status === "No Punch In";
    if (activeFilter === "Late") return staff.punchTime && staff.punchTime > "09:15 AM";
    return true;
  }).filter((staff) => staff.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleReset = () => {
    setSelectedBranch("All Branches");
    setSelectedDept("All Departments");
    setSelectedShift("All Shifts");
    setSearchTerm("");
    setActiveFilter("In");
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
      {/* 1. Page Header matching Screenshot 1 */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">Live Attendance</h1>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left Filter Sidebar matching Screenshot 1 */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 space-y-4 shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#007BFF] hover:underline"
            >
              Reset
            </button>
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
                <option>Management</option>
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
                <option>Morning Shift (6 AM - 2 PM)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 p-4 flex flex-col space-y-4">
          {/* Top Status Summary Pills matching Screenshot 1 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {statusPills.map((pill) => {
              const isActive = activeFilter === pill.label;
              return (
                <button
                  key={pill.label}
                  onClick={() => setActiveFilter(pill.label)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#EBF5FF] text-[#007BFF] border-blue-300 font-semibold"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {pill.label} ({pill.count})
                </button>
              );
            })}
          </div>

          {/* Search Bar & Counter */}
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

          {/* Staff List matching Screenshot 1 */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-[#FAFBFD] px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase">
              <span>Staff</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="px-4 py-3.5 flex items-start sm:items-center justify-between hover:bg-slate-50/70 transition-colors gap-3"
                >
                  {/* Left Column: Avatar + Name + Subtitle Location */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${staff.avatarColor}`}
                    >
                      {staff.initials}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800 hover:text-blue-600 cursor-pointer">
                          {staff.name}
                        </span>
                        {staff.status === "No Punch In" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                        )}
                      </div>

                      {staff.address && (
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-xl line-clamp-1">
                          {staff.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status Badge + Time */}
                  <div className="text-right shrink-0">
                    {staff.status === "In" && (
                      <div>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In
                        </span>
                        {staff.punchTime && (
                          <div className="text-[10px] text-slate-500 font-medium mt-1">
                            {staff.punchTime}
                          </div>
                        )}
                      </div>
                    )}

                    {staff.status === "No Punch In" && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                        No Punch In
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}