"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck
} from "lucide-react";

interface EmployeeItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  jobTitle?: string;
  verificationStatus: "Not Started" | "Verified" | "Pending";
  employeeId?: string;
  employeeType?: string;
  dateOfJoining?: string;
  dateOfLeaving?: string;
  needsActivation?: boolean;
  scheduleType?: string;
  smartphoneAttendance?: string;
  selfie?: string;
  qr?: string;
  markFrom?: string;
  biometric?: string;
  autoPresent?: string;
  presentOnPunchIn?: string;
  bankName?: string;
  bankAccount?: string;
  monthlyCtc?: number;
  leaveBalance?: number;
}

const INITIAL_STAFF: EmployeeItem[] = [
  {
    id: "1",
    name: "Anil",
    initials: "A",
    avatarColor: "bg-blue-500",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Anywhere",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "HDFC Bank",
    bankAccount: "•••• 4812",
    monthlyCtc: 35000,
    leaveBalance: 12,
  },
  {
    id: "2",
    name: "Bobba Prasad",
    initials: "BP",
    avatarColor: "bg-purple-500",
    jobTitle: "Technician",
    verificationStatus: "Not Started",
    dateOfJoining: "03/07/2026",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "State Bank of India",
    bankAccount: "•••• 9102",
    monthlyCtc: 28000,
    leaveBalance: 10,
  },
  {
    id: "3",
    name: "DARA DEEKSHITH",
    initials: "DD",
    avatarColor: "bg-teal-500",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "03/06/2026",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "ICICI Bank",
    bankAccount: "•••• 3341",
    monthlyCtc: 32000,
    leaveBalance: 14,
  },
  {
    id: "4",
    name: "Durga Prasad Cargo CUG",
    initials: "DP",
    avatarColor: "bg-emerald-500",
    jobTitle: "",
    verificationStatus: "Not Started",
    employeeType: "Full Time",
    dateOfJoining: "03/06/2026",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "Axis Bank",
    bankAccount: "•••• 7721",
    monthlyCtc: 40000,
    leaveBalance: 15,
  },
  {
    id: "5",
    name: "Medipalli Nanibabu",
    initials: "MN",
    avatarColor: "bg-indigo-500",
    jobTitle: "Trainee Technician",
    verificationStatus: "Not Started",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "HDFC Bank",
    bankAccount: "•••• 1120",
    monthlyCtc: 22000,
    leaveBalance: 8,
  },
  {
    id: "6",
    name: "Priyanka EDP RSS VJA",
    initials: "P",
    avatarColor: "bg-pink-500",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "Kotak Mahindra Bank",
    bankAccount: "•••• 8834",
    monthlyCtc: 30000,
    leaveBalance: 11,
  },
  {
    id: "7",
    name: "Rajesh Service Manager CU...",
    initials: "R",
    avatarColor: "bg-amber-600",
    jobTitle: "Service Manager",
    verificationStatus: "Not Started",
    employeeType: "Permanent",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "HDFC Bank",
    bankAccount: "•••• 4419",
    monthlyCtc: 55000,
    leaveBalance: 18,
  },
  {
    id: "8",
    name: "Saleem",
    initials: "S",
    avatarColor: "bg-purple-600",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "State Bank of India",
    bankAccount: "•••• 6542",
    monthlyCtc: 25000,
    leaveBalance: 9,
  },
  {
    id: "9",
    name: "Shaaru",
    initials: "S",
    avatarColor: "bg-violet-500",
    jobTitle: "Technician",
    verificationStatus: "Not Started",
    employeeType: "Full Time",
    dateOfJoining: "",
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "Canara Bank",
    bankAccount: "•••• 9031",
    monthlyCtc: 27000,
    leaveBalance: 12,
  },
  {
    id: "10",
    name: "Venkat Krish...",
    initials: "V",
    avatarColor: "bg-slate-500",
    jobTitle: "Service Manager",
    verificationStatus: "Not Started",
    dateOfJoining: "07/07/2026",
    needsActivation: true,
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Anywhere",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "HDFC Bank",
    bankAccount: "•••• 1982",
    monthlyCtc: 50000,
    leaveBalance: 15,
  },
  {
    id: "11",
    name: "Bhanu",
    initials: "B",
    avatarColor: "bg-amber-700",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "13/07/2026",
    needsActivation: true,
    scheduleType: "Flexible",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Anywhere",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "Axis Bank",
    bankAccount: "•••• 5521",
    monthlyCtc: 26000,
    leaveBalance: 12,
  },
  {
    id: "12",
    name: "CH Rajasekh...",
    initials: "CR",
    avatarColor: "bg-orange-600",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "31/05/2026",
    needsActivation: true,
    scheduleType: "Flexible",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "HDFC Bank",
    bankAccount: "•••• 7310",
    monthlyCtc: 34000,
    leaveBalance: 14,
  },
  {
    id: "13",
    name: "Kuraganti Pa...",
    initials: "KV",
    avatarColor: "bg-cyan-600",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "",
    needsActivation: true,
    scheduleType: "Fixed",
    smartphoneAttendance: "Yes",
    selfie: "Yes",
    qr: "No",
    markFrom: "Office",
    biometric: "No",
    autoPresent: "No",
    presentOnPunchIn: "No",
    bankName: "ICICI Bank",
    bankAccount: "•••• 8219",
    monthlyCtc: 29000,
    leaveBalance: 10,
  },
];

export function MyTeamView() {
  const [activeTab, setActiveActiveTab] = useState("Staff Details");
  const [activeSubTab, setActiveSubTab] = useState("Work Timings");
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState<EmployeeItem[]>(INITIAL_STAFF);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    jobTitle: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    employeeType: "Full Time",
    monthlyCtc: 30000,
  });

  const tabs = [
    "Staff Details",
    "Attendance Details",
    "Bank Details",
    "Salary Details",
    "Leave Details",
    "Penalty & Overtime",
    "Permissions",
    "Approval Flows",
  ];

  const attendanceSubTabs = ["Work Timings", "Attendance Modes", "Automation Rules"];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaff(staffList.map((s) => s.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedStaff.includes(id)) {
      setSelectedStaff(selectedStaff.filter((item) => item !== id));
    } else {
      setSelectedStaff([...selectedStaff, id]);
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.firstName || !newStaff.phone) {
      alert("Please provide at least First Name and Phone Number");
      return;
    }

    const initials = (newStaff.firstName.slice(0, 1) + (newStaff.lastName?.slice(0, 1) || "")).toUpperCase();
    const created: EmployeeItem = {
      id: String(Date.now()),
      name: `${newStaff.firstName} ${newStaff.lastName}`.trim(),
      initials: initials || "EMP",
      avatarColor: "bg-blue-600",
      jobTitle: newStaff.jobTitle || "Executive",
      verificationStatus: "Not Started",
      employeeType: newStaff.employeeType,
      dateOfJoining: newStaff.dateOfJoining,
      scheduleType: "Fixed",
      smartphoneAttendance: "Yes",
      selfie: "Yes",
      qr: "No",
      markFrom: "Office",
      biometric: "No",
      autoPresent: "No",
      presentOnPunchIn: "No",
      bankName: "HDFC Bank",
      bankAccount: "•••• 0000",
      monthlyCtc: Number(newStaff.monthlyCtc),
      leaveBalance: 12,
    };

    setStaffList([created, ...staffList]);
    setIsAddModalOpen(false);
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.jobTitle && staff.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-base font-bold text-slate-800 tracking-tight">My Team</h1>
      </div>

      {/* 2. Tabs */}
      <div className="border-b border-slate-200 px-4 flex items-center gap-6 overflow-x-auto text-xs font-medium text-slate-600">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveActiveTab(tab)}
              className={`py-3 whitespace-nowrap transition-colors relative ${
                isActive
                  ? "text-[#007BFF] font-semibold border-b-2 border-[#007BFF]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Pills */}
      {activeTab === "Attendance Details" && (
        <div className="p-3 px-4 border-b border-slate-100 flex items-center gap-2 bg-[#FAFBFD]">
          {attendanceSubTabs.map((subTab) => {
            const isActive = activeSubTab === subTab;
            return (
              <button
                key={subTab}
                onClick={() => setActiveSubTab(subTab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#EBF5FF] text-[#007BFF] border border-blue-200 font-semibold"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {subTab}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Filter Bar */}
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Staff"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            <span>All Branches</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            <span>All Departments</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>More Filters</span>
          </button>

          <button className="flex items-center gap-1 text-xs text-[#007BFF] hover:underline ml-2">
            <Eye className="w-3.5 h-3.5" />
            <span>Show Fields</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {activeTab === "Staff Details" && (
            <>
              <button
                className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
                onClick={() => alert("Batch Update Staff")}
              >
                Update Staff
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff</span>
              </button>
            </>
          )}

          {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => alert("Update Work Timings modal")}
            >
              Update Work Timings
            </button>
          )}

          {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => alert("Update Attendance Modes modal")}
            >
              Update Attendance Modes
            </button>
          )}

          {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => alert("Update Automation Rules modal")}
            >
              Update Automation Rules
            </button>
          )}
        </div>
      </div>

      {/* 5. Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedStaff.length === staffList.length && staffList.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Job Title</th>

              {activeTab === "Staff Details" && (
                <>
                  <th className="px-4 py-3">Verification Status</th>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Employee Type</th>
                  <th className="px-4 py-3">Date of Joining</th>
                  <th className="px-4 py-3">Date of Leaving</th>
                </>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
                <th className="px-4 py-3">Schedule Type</th>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
                <>
                  <th className="px-4 py-3">Smartphone Attendance</th>
                  <th className="px-4 py-3">Selfie</th>
                  <th className="px-4 py-3">QR</th>
                  <th className="px-4 py-3">Mark Attendance From</th>
                  <th className="px-4 py-3">Biometric</th>
                </>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
                <>
                  <th className="px-4 py-3">Auto Present</th>
                  <th className="px-4 py-3">Present On Punch In</th>
                  <th className="px-4 py-3">Auto Half Day</th>
                  <th className="px-4 py-3">Mandatory Half Day Hours</th>
                  <th className="px-4 py-3">Mandatory Full Day Hours</th>
                </>
              )}

              {activeTab === "Bank Details" && (
                <>
                  <th className="px-4 py-3">Bank Name</th>
                  <th className="px-4 py-3">Bank Account</th>
                  <th className="px-4 py-3">Penny Drop Status</th>
                </>
              )}

              {activeTab === "Salary Details" && (
                <>
                  <th className="px-4 py-3">Monthly CTC</th>
                  <th className="px-4 py-3">Basic Pay</th>
                  <th className="px-4 py-3">PF / ESI</th>
                </>
              )}

              {activeTab === "Leave Details" && (
                <>
                  <th className="px-4 py-3">Available Leaves</th>
                  <th className="px-4 py-3">Leave History</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredStaff.map((staff) => {
              const isSelected = selectedStaff.includes(staff.id);

              return (
                <tr
                  key={staff.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    isSelected ? "bg-blue-50/60" : ""
                  }`}
                >
                  <td className="w-10 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(staff.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${staff.avatarColor}`}
                      >
                        {staff.initials}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#007BFF] hover:underline cursor-pointer">
                          {staff.name}
                        </span>

                        {staff.needsActivation && (
                          <button className="px-2 py-0.5 text-[10px] font-semibold text-[#007BFF] border border-[#007BFF] rounded-full hover:bg-blue-50">
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {staff.jobTitle || "-"}
                  </td>

                  {activeTab === "Staff Details" && (
                    <>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-red-600 bg-red-50">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span>{staff.verificationStatus}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{staff.employeeId || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.employeeType || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.dateOfJoining || "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.dateOfLeaving || "-"}</td>
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
                    <td className="px-4 py-3 text-slate-600">{staff.scheduleType || "Fixed"}</td>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
                    <>
                      <td className="px-4 py-3 text-slate-600">{staff.smartphoneAttendance}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.selfie}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.qr}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.markFrom}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.biometric}</td>
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
                    <>
                      <td className="px-4 py-3 text-slate-600">{staff.autoPresent}</td>
                      <td className="px-4 py-3 text-slate-600">{staff.presentOnPunchIn}</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                      <td className="px-4 py-3 text-slate-400">-</td>
                    </>
                  )}

                  {activeTab === "Bank Details" && (
                    <>
                      <td className="px-4 py-3 font-medium text-slate-800">{staff.bankName}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{staff.bankAccount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Penny Drop Verified</span>
                        </span>
                      </td>
                    </>
                  )}

                  {activeTab === "Salary Details" && (
                    <>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        ₹{staff.monthlyCtc?.toLocaleString("en-IN")} / mo
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ₹{Math.round((staff.monthlyCtc || 0) * 0.5).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-slate-600">Standard 12% PF</td>
                    </>
                  )}

                  {activeTab === "Leave Details" && (
                    <>
                      <td className="px-4 py-3 font-bold text-blue-600">{staff.leaveBalance} Days</td>
                      <td className="px-4 py-3 text-slate-500">0 Used in 2026</td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#007BFF]" />
                <h3 className="font-bold text-slate-800 text-sm">Add New Staff Member</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Technician"
                    value={newStaff.jobTitle}
                    onChange={(e) => setNewStaff({ ...newStaff, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={newStaff.dateOfJoining}
                    onChange={(e) => setNewStaff({ ...newStaff, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Type</label>
                  <select
                    value={newStaff.employeeType}
                    onChange={(e) => setNewStaff({ ...newStaff, employeeType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly CTC (₹)</label>
                  <input
                    type="number"
                    value={newStaff.monthlyCtc}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlyCtc: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}