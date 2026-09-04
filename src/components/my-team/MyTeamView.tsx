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
import { EmployeeDetailView } from "./EmployeeDetailView";

interface EmployeeItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  needsActivation?: boolean;
  jobTitle?: string;
  verificationStatus: "Not Started" | "Verified" | "Pending";
  employeeId?: string;
  employeeType?: string;
  dateOfJoining?: string;
  dateOfLeaving?: string;
  dateOfBirth?: string;
  mobileNumber?: string;
  personalEmail?: string;
  officialEmail?: string;
  maritalStatus?: string;
  gender?: string;
  bloodGroup?: string;
  currentAddress?: string;
  permanentAddress?: string;
  aadhaar?: string;
  pan?: string;
  uan?: string;
  pfAccountNo?: string;
  esiAccountNo?: string;
  drivingLicense?: string;
  voterId?: string;
  guardianName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddress?: string;
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
    id: "1",
    name: "Anil",
    initials: "A",
    avatarColor: "bg-blue-500",
    jobTitle: "",
    verificationStatus: "Not Started",
    dateOfJoining: "",
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
    bankAccount: "•••• 4812",
    monthlyCtc: 35000,
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

const getFieldsForCurrentTab = (tab: string, subTab: string): { key: string; label: string }[] => {
  if (tab === "Staff Details") {
    return [
      { key: "jobTitle", label: "Job Title" },
      { key: "verificationStatus", label: "Verification Status" },
      { key: "employeeId", label: "Employee ID" },
      { key: "employeeType", label: "Employee Type" },
      { key: "dateOfJoining", label: "Date of Joining" },
      { key: "dateOfLeaving", label: "Date of Leaving" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "mobileNumber", label: "Mobile Number" },
      { key: "personalEmail", label: "Personal Email ID" },
      { key: "officialEmail", label: "Official Email ID" },
      { key: "maritalStatus", label: "Marital Status" },
      { key: "gender", label: "Gender" },
      { key: "bloodGroup", label: "Blood Group" },
      { key: "currentAddress", label: "Current Address" },
      { key: "permanentAddress", label: "Permanent Address" },
      { key: "aadhaar", label: "Aadhaar" },
      { key: "pan", label: "PAN" },
      { key: "uan", label: "UAN" },
      { key: "pfAccountNo", label: "PF A/C No." },
      { key: "esiAccountNo", label: "ESI A/C No." },
      { key: "drivingLicense", label: "Driving License" },
      { key: "voterId", label: "Voter ID" },
      { key: "guardianName", label: "Guardian Name" },
      { key: "emergencyContactName", label: "Emergency Contact Name" },
      { key: "emergencyContactPhone", label: "Emergency Contact Phone Number" },
      { key: "emergencyContactRelationship", label: "Emergency Contact Relationship" },
      { key: "emergencyContactAddress", label: "Emergency Contact Address" },
    ];
  }
  if (tab === "Attendance Details") {
    if (subTab === "Work Timings") {
      return [
        { key: "scheduleType", label: "Schedule Type" },
      ];
    }
    if (subTab === "Attendance Modes") {
      return [
        { key: "smartphoneAttendance", label: "Smartphone Attendance" },
        { key: "selfie", label: "Selfie" },
        { key: "qr", label: "QR" },
        { key: "markFrom", label: "Mark Attendance From" },
        { key: "biometric", label: "Biometric" },
      ];
    }
    if (subTab === "Automation Rules") {
      return [
        { key: "autoPresent", label: "Auto Present" },
        { key: "presentOnPunchIn", label: "Present on Punch In" },
        { key: "autoHalfDay", label: "Auto Half Day" },
        { key: "mandatoryHalfDayHours", label: "Mandatory Half Day Hours" },
        { key: "mandatoryFullDayHours", label: "Mandatory Full Day Hours" },
      ];
    }
  }
  if (tab === "Bank Details") {
    return [
      { key: "bankName", label: "Bank Name" },
      { key: "bankAccount", label: "Bank Account" },
      { key: "pennyDropStatus", label: "Penny Drop Status" },
    ];
  }
  if (tab === "Salary Details") {
    return [
      { key: "monthlyCtc", label: "Monthly CTC" },
      { key: "basicPay", label: "Basic Pay (50%)" },
      { key: "hra", label: "HRA (25%)" },
      { key: "pfDeduction", label: "PF Deduction (12%)" },
      { key: "esi", label: "ESI" },
      { key: "netPay", label: "Net Pay" },
    ];
  }
  if (tab === "Leave Details") {
    return [
      { key: "availableLeaves", label: "Available Leaves" },
      { key: "leaveHistory", label: "Leave History" },
    ];
  }
  if (tab === "Penalty & Overtime") {
    return [
      { key: "earlyLeaving", label: "Early Leaving Policy" },
      { key: "lateComing", label: "Late Coming Policy" },
      { key: "overtime", label: "Overtime Policy" },
    ];
  }
  if (tab === "Permissions") {
    return [
      { key: "role", label: "Role" },
      { key: "appAccess", label: "App Access" },
      { key: "webAccess", label: "Web Access" },
    ];
  }
  if (tab === "Approval Flows") {
    return [
      { key: "leaveApprover", label: "Leave Approver" },
      { key: "attendanceApprover", label: "Attendance Approver" },
    ];
  }
  return [];
};

export function MyTeamView() {
  const [activeTab, setActiveActiveTab] = useState("Staff Details");
  const [activeSubTab, setActiveSubTab] = useState("Work Timings");
  const [searchTerm, setSearchTerm] = useState("");
  const [staffList, setStaffList] = useState<EmployeeItem[]>(INITIAL_STAFF);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShowFieldsOpen, setIsShowFieldsOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [activatingStaff, setActivatingStaff] = useState<EmployeeItem | null>(null);

  // More Filters state (1:1 Screenshots Match)
  const [filterStaffStatus, setFilterStaffStatus] = useState("All Staff");
  const [filterGender, setFilterGender] = useState("All");
  const [filterEmployeeType, setFilterEmployeeType] = useState("All");

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    jobTitle: true,
    verificationStatus: true,
    employeeId: true,
    employeeType: true,
    dateOfJoining: true,
    dateOfLeaving: true,
    dateOfBirth: true,
    mobileNumber: true,
    personalEmail: true,
    officialEmail: true,
    maritalStatus: true,
    gender: true,
    bloodGroup: true,
    currentAddress: true,
    permanentAddress: true,
    aadhaar: true,
    pan: true,
    uan: true,
    pfAccountNo: true,
    esiAccountNo: true,
    drivingLicense: true,
    voterId: true,
    guardianName: true,
    emergencyContactName: true,
    emergencyContactPhone: true,
    emergencyContactRelationship: true,
    emergencyContactAddress: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const activeStaffIds = staffList.filter((s) => !s.needsActivation).map((s) => s.id);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaff(activeStaffIds);
    } else {
      setSelectedStaff([]);
    }
  };

  const isAllActiveSelected =
    activeStaffIds.length > 0 &&
    activeStaffIds.every((id) => selectedStaff.includes(id));

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

  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<EmployeeItem | null>(null);

  const filteredStaff = staffList.filter((staff) => {
    // 1. Search Query
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.jobTitle && staff.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Staff Status Filter (All Staff / Active Staff / Inactive Staff)
    if (filterStaffStatus === "Active Staff" && staff.needsActivation) return false;
    if (filterStaffStatus === "Inactive Staff" && !staff.needsActivation) return false;

    // 3. Gender Filter (All / Male / Female / Others)
    if (filterGender !== "All") {
      if ((staff.gender || "Male") !== filterGender) return false;
    }

    // 4. Employee Type Filter (All / Full Time / Permanent / Part Time / Consultant / Temporary / Probation / Intern)
    if (filterEmployeeType !== "All") {
      if ((staff.employeeType || "Full Time") !== filterEmployeeType) return false;
    }

    return true;
  });

  if (selectedEmployeeForDetail) {
    return (
      <EmployeeDetailView
        employee={selectedEmployeeForDetail}
        onBack={() => setSelectedEmployeeForDetail(null)}
        onUpdate={(updated) => {
          setStaffList(
            staffList.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
          );
          setSelectedEmployeeForDetail(null);
        }}
      />
    );
  }

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

          {/* More Filters Popover Button & Modal (1:1 Screenshot Match) */}
          <div className="relative">
            <button
              onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                isMoreFiltersOpen || filterStaffStatus !== "All Staff" || filterGender !== "All" || filterEmployeeType !== "All"
                  ? "text-[#007BFF] bg-blue-50/50 border-blue-300 font-semibold"
                  : "text-slate-700 bg-white border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>More Filters</span>
            </button>

            {/* 1:1 SalaryBox More Filters Popover Modal */}
            {isMoreFiltersOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreFiltersOpen(false)}
                />

                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  {/* Top Arrow Tip */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />

                  {/* Modal Title */}
                  <div className="font-bold text-slate-800 text-xs pb-4 border-b border-slate-100">
                    More Filters
                  </div>

                  {/* Filter Rows */}
                  <div className="py-4 space-y-4">
                    {/* 1. Staff Status (Screenshot 2) */}
                    <div className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-4 text-right text-slate-700 font-medium text-xs">
                        Staff Status:
                      </div>
                      <div className="col-span-8 relative">
                        <select
                          value={filterStaffStatus}
                          onChange={(e) => setFilterStaffStatus(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>All Staff</option>
                          <option>Active Staff</option>
                          <option>Inactive Staff</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 2. Gender (Screenshot 3) */}
                    <div className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-4 text-right text-slate-700 font-medium text-xs">
                        Gender:
                      </div>
                      <div className="col-span-8 relative">
                        <select
                          value={filterGender}
                          onChange={(e) => setFilterGender(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>All</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Others</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 3. Employee Type (Screenshot 4) */}
                    <div className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-4 text-right text-slate-700 font-medium text-xs">
                        Employee Type:
                      </div>
                      <div className="col-span-8 relative">
                        <select
                          value={filterEmployeeType}
                          onChange={(e) => setFilterEmployeeType(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer max-h-40 overflow-y-auto"
                        >
                          <option>All</option>
                          <option>Full Time</option>
                          <option>Permanent</option>
                          <option>Part Time</option>
                          <option>Consultant</option>
                          <option>Temporary</option>
                          <option>Probation</option>
                          <option>Intern</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Close Blue Button */}
                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setIsMoreFiltersOpen(false)}
                      className="px-6 py-1.5 rounded-md bg-[#007BFF] hover:bg-blue-600 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Show Fields Popover Button & Modal */}
          <div className="relative">
            <button
              onClick={() => setIsShowFieldsOpen(!isShowFieldsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#007BFF] bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors cursor-pointer font-medium"
            >
              <Eye className="w-3.5 h-3.5 text-[#007BFF]" />
              <span>Show Fields</span>
            </button>

            {/* 1:1 SalaryBox Show Fields Popover Modal */}
            {isShowFieldsOpen && (
              <>
                {/* Backdrop to close on click outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsShowFieldsOpen(false)}
                />

                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 ${getFieldsForCurrentTab(activeTab, activeSubTab).length > 4 ? "w-[520px]" : "w-[360px]"} bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in fade-in zoom-in-95 duration-150`}>
                  {/* Top Arrow Tip */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />

                  {/* Dynamic Checkboxes Grid */}
                  {(() => {
                    const fields = getFieldsForCurrentTab(activeTab, activeSubTab);
                    const midpoint = Math.ceil(fields.length / 2);
                    const col1 = fields.slice(0, midpoint);
                    const col2 = fields.slice(midpoint);

                    return (
                      <div className={`grid ${fields.length > 4 ? "grid-cols-2 gap-x-8" : "grid-cols-1"} gap-y-3.5 text-xs text-slate-800`}>
                        {/* Column 1 (Left) */}
                        <div className="space-y-3.5">
                          {col1.map((field) => (
                            <label key={field.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={visibleColumns[field.key] !== false}
                                onChange={() => toggleColumn(field.key)}
                                className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="font-medium">{field.label}</span>
                            </label>
                          ))}
                        </div>

                        {/* Column 2 (Right) */}
                        {col2.length > 0 && (
                          <div className="space-y-3.5">
                            {col2.map((field) => (
                              <label key={field.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={visibleColumns[field.key] !== false}
                                  onChange={() => toggleColumn(field.key)}
                                  className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="font-medium">{field.label}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Apply Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => setIsShowFieldsOpen(false)}
                      className="px-8 py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {activeTab === "Staff Details" && (
            <>
              {selectedStaff.length > 0 && (
                <span className="text-xs text-slate-500 font-medium mr-1 select-none">
                  {isAllActiveSelected ? "All staff selected" : `${selectedStaff.length} staff selected`}
                </span>
              )}
              <button
                className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => alert("Batch Update Staff")}
              >
                Update Staff
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
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

      {/* 5. Data Table with Sticky Name Column */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {/* Sticky Checkbox & Name Column */}
              <th className="sticky left-0 bg-[#FAFBFD] z-20 px-4 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-slate-200">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isAllActiveSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-[#007BFF] font-bold">NAME</span>
                </div>
              </th>

              {activeTab === "Staff Details" && (
                <>
                  {visibleColumns.jobTitle && <th className="px-4 py-3">JOB TITLE</th>}
                  {visibleColumns.verificationStatus && <th className="px-4 py-3">VERIFICATION STATUS</th>}
                  {visibleColumns.employeeId && <th className="px-4 py-3">EMPLOYEE ID</th>}
                  {visibleColumns.employeeType && <th className="px-4 py-3">EMPLOYEE TYPE</th>}
                  {visibleColumns.dateOfJoining && <th className="px-4 py-3">DATE OF JOINING</th>}
                  {visibleColumns.dateOfLeaving && <th className="px-4 py-3">DATE OF LEAVING</th>}
                  {visibleColumns.dateOfBirth && <th className="px-4 py-3">DATE OF BIRTH</th>}
                  {visibleColumns.mobileNumber && <th className="px-4 py-3">MOBILE NUMBER</th>}
                  {visibleColumns.personalEmail && <th className="px-4 py-3">PERSONAL EMAIL ID</th>}
                  {visibleColumns.officialEmail && <th className="px-4 py-3">OFFICIAL EMAIL ID</th>}
                  {visibleColumns.maritalStatus && <th className="px-4 py-3">MARITAL STATUS</th>}
                  {visibleColumns.gender && <th className="px-4 py-3">GENDER</th>}
                  {visibleColumns.bloodGroup && <th className="px-4 py-3">BLOOD GROUP</th>}
                  {visibleColumns.currentAddress && <th className="px-4 py-3">CURRENT ADDRESS</th>}
                  {visibleColumns.permanentAddress && <th className="px-4 py-3">PERMANENT ADDRESS</th>}
                  {visibleColumns.aadhaar && <th className="px-4 py-3">AADHAAR</th>}
                  {visibleColumns.pan && <th className="px-4 py-3">PAN</th>}
                  {visibleColumns.uan && <th className="px-4 py-3">UAN</th>}
                  {visibleColumns.pfAccountNo && <th className="px-4 py-3">PF A/C NO.</th>}
                  {visibleColumns.esiAccountNo && <th className="px-4 py-3">ESI A/C NO.</th>}
                  {visibleColumns.drivingLicense && <th className="px-4 py-3">DRIVING LICENSE</th>}
                  {visibleColumns.voterId && <th className="px-4 py-3">VOTER ID</th>}
                  {visibleColumns.guardianName && <th className="px-4 py-3">GUARDIAN NAME</th>}
                  {visibleColumns.emergencyContactName && (
                    <th className="px-4 py-3 text-[#007BFF]">EMERGENCY CONTACT NAME</th>
                  )}
                  {visibleColumns.emergencyContactPhone && (
                    <th className="px-4 py-3 text-[#007BFF]">EMERGENCY CONTACT PHONE NUMBER</th>
                  )}
                  {visibleColumns.emergencyContactRelationship && (
                    <th className="px-4 py-3 text-[#007BFF]">EMERGENCY CONTACT RELATIONSHIP</th>
                  )}
                  {visibleColumns.emergencyContactAddress && (
                    <th className="px-4 py-3 text-[#007BFF]">EMERGENCY CONTACT ADDRESS</th>
                  )}
                </>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
                <>
                  {visibleColumns.scheduleType !== false && <th className="px-4 py-3">SCHEDULE TYPE</th>}
                </>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
                <>
                  {visibleColumns.smartphoneAttendance !== false && <th className="px-4 py-3">SMARTPHONE ATTENDANCE</th>}
                  {visibleColumns.selfie !== false && <th className="px-4 py-3">SELFIE</th>}
                  {visibleColumns.qr !== false && <th className="px-4 py-3">QR</th>}
                  {visibleColumns.markFrom !== false && <th className="px-4 py-3">MARK ATTENDANCE FROM</th>}
                  {visibleColumns.biometric !== false && <th className="px-4 py-3">BIOMETRIC</th>}
                </>
              )}

              {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
                <>
                  {visibleColumns.autoPresent !== false && <th className="px-4 py-3">AUTO PRESENT</th>}
                  {visibleColumns.presentOnPunchIn !== false && <th className="px-4 py-3">PRESENT ON PUNCH IN</th>}
                  {visibleColumns.autoHalfDay !== false && <th className="px-4 py-3">AUTO HALF DAY</th>}
                  {visibleColumns.mandatoryHalfDayHours !== false && <th className="px-4 py-3">MANDATORY HALF DAY HOURS</th>}
                  {visibleColumns.mandatoryFullDayHours !== false && <th className="px-4 py-3">MANDATORY FULL DAY HOURS</th>}
                </>
              )}

              {activeTab === "Bank Details" && (
                <>
                  {visibleColumns.bankName !== false && <th className="px-4 py-3">BANK NAME</th>}
                  {visibleColumns.bankAccount !== false && <th className="px-4 py-3">BANK ACCOUNT</th>}
                  {visibleColumns.pennyDropStatus !== false && <th className="px-4 py-3">PENNY DROP STATUS</th>}
                </>
              )}

              {activeTab === "Salary Details" && (
                <>
                  {visibleColumns.monthlyCtc !== false && <th className="px-4 py-3">MONTHLY CTC</th>}
                  {visibleColumns.basicPay !== false && <th className="px-4 py-3">BASIC PAY (50%)</th>}
                  {visibleColumns.hra !== false && <th className="px-4 py-3">HRA (25%)</th>}
                  {visibleColumns.pfDeduction !== false && <th className="px-4 py-3">PF DEDUCTION (12%)</th>}
                  {visibleColumns.esi !== false && <th className="px-4 py-3">ESI</th>}
                  {visibleColumns.netPay !== false && <th className="px-4 py-3">NET PAY</th>}
                </>
              )}

              {activeTab === "Leave Details" && (
                <>
                  {visibleColumns.availableLeaves !== false && <th className="px-4 py-3">AVAILABLE LEAVES</th>}
                  {visibleColumns.leaveHistory !== false && <th className="px-4 py-3">LEAVE HISTORY</th>}
                </>
              )}

              {activeTab === "Penalty & Overtime" && (
                <>
                  {visibleColumns.earlyLeaving !== false && <th className="px-4 py-3">EARLY LEAVING POLICY</th>}
                  {visibleColumns.lateComing !== false && <th className="px-4 py-3">LATE COMING POLICY</th>}
                  {visibleColumns.overtime !== false && <th className="px-4 py-3">OVERTIME POLICY</th>}
                </>
              )}

              {activeTab === "Permissions" && (
                <>
                  {visibleColumns.role !== false && <th className="px-4 py-3">ROLE</th>}
                  {visibleColumns.appAccess !== false && <th className="px-4 py-3">APP ACCESS</th>}
                  {visibleColumns.webAccess !== false && <th className="px-4 py-3">WEB ACCESS</th>}
                </>
              )}

              {activeTab === "Approval Flows" && (
                <>
                  {visibleColumns.leaveApprover !== false && <th className="px-4 py-3">LEAVE APPROVER</th>}
                  {visibleColumns.attendanceApprover !== false && <th className="px-4 py-3">ATTENDANCE APPROVER</th>}
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
                    isSelected ? "bg-[#EBF5FF]" : staff.needsActivation ? "opacity-75" : ""
                  }`}
                >
                  {/* Sticky Name Column */}
                  <td className={`sticky left-0 ${isSelected ? "bg-[#EBF5FF]" : "bg-white"} hover:bg-blue-50/40 z-20 px-4 py-3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-slate-200`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(staff.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div
                        className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${staff.avatarColor} ${staff.needsActivation ? "opacity-60" : ""}`}
                      >
                        {staff.initials}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => setSelectedEmployeeForDetail(staff)}
                          className={`font-semibold hover:underline cursor-pointer ${staff.needsActivation ? "text-slate-600" : "text-[#007BFF]"}`}
                        >
                          {staff.name}
                        </span>

                        {staff.needsActivation && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivatingStaff(staff);
                            }}
                            className="px-2 py-0.5 text-[10px] font-semibold text-[#007BFF] border border-[#007BFF] rounded-full hover:bg-blue-50 cursor-pointer"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </td>

                  {activeTab === "Staff Details" && (
                    <>
                      {visibleColumns.jobTitle !== false && <td className="px-4 py-3 text-slate-600">{staff.jobTitle || "-"}</td>}
                      {visibleColumns.verificationStatus !== false && (
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white flex items-center justify-center text-[9px] font-bold">!</span>
                            <span>{staff.verificationStatus}</span>
                          </span>
                        </td>
                      )}
                      {visibleColumns.employeeId !== false && (
                        <td className="px-4 py-3 font-mono text-slate-500">{staff.employeeId || "-"}</td>
                      )}
                      {visibleColumns.employeeType !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.employeeType || "Full Time"}</td>
                      )}
                      {visibleColumns.dateOfJoining !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.dateOfJoining || "-"}</td>
                      )}
                      {visibleColumns.dateOfLeaving !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.dateOfLeaving || "-"}</td>
                      )}
                      {visibleColumns.dateOfBirth !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.dateOfBirth || "-"}</td>
                      )}
                      {visibleColumns.mobileNumber !== false && (
                        <td className="px-4 py-3 font-mono">{staff.mobileNumber || "-"}</td>
                      )}
                      {visibleColumns.personalEmail !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.personalEmail || "-"}</td>
                      )}
                      {visibleColumns.officialEmail !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.officialEmail || "-"}</td>
                      )}
                      {visibleColumns.maritalStatus !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.maritalStatus || "-"}</td>
                      )}
                      {visibleColumns.gender !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.gender || "Male"}</td>
                      )}
                      {visibleColumns.bloodGroup !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.bloodGroup || "-"}</td>
                      )}
                      {visibleColumns.currentAddress !== false && (
                        <td className="px-4 py-3 max-w-[200px] truncate" title={staff.currentAddress}>
                          {staff.currentAddress || "-"}
                        </td>
                      )}
                      {visibleColumns.permanentAddress !== false && (
                        <td className="px-4 py-3 max-w-[200px] truncate">{staff.permanentAddress || "-"}</td>
                      )}
                      {visibleColumns.aadhaar !== false && (
                        <td className="px-4 py-3 font-mono">{staff.aadhaar || "•••• •••• ••••"}</td>
                      )}
                      {visibleColumns.pan !== false && (
                        <td className="px-4 py-3 font-mono">{staff.pan || "••••••••••"}</td>
                      )}
                      {visibleColumns.uan !== false && <td className="px-4 py-3 font-mono">{staff.uan || "-"}</td>}
                      {visibleColumns.pfAccountNo !== false && (
                        <td className="px-4 py-3 font-mono">{staff.pfAccountNo || "-"}</td>
                      )}
                      {visibleColumns.esiAccountNo !== false && (
                        <td className="px-4 py-3 font-mono">{staff.esiAccountNo || "-"}</td>
                      )}
                      {visibleColumns.drivingLicense !== false && <td className="px-4 py-3">{staff.drivingLicense || "-"}</td>}
                      {visibleColumns.voterId !== false && <td className="px-4 py-3">{staff.voterId || "-"}</td>}
                      {visibleColumns.guardianName !== false && <td className="px-4 py-3">{staff.guardianName || "-"}</td>}
                      {visibleColumns.emergencyContactName !== false && (
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {staff.emergencyContactName || "-"}
                        </td>
                      )}
                      {visibleColumns.emergencyContactPhone !== false && (
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {staff.emergencyContactPhone || "-"}
                        </td>
                      )}
                      {visibleColumns.emergencyContactRelationship !== false && (
                        <td className="px-4 py-3">{staff.emergencyContactRelationship || "-"}</td>
                      )}
                      {visibleColumns.emergencyContactAddress !== false && (
                        <td className="px-4 py-3 max-w-[200px] truncate" title={staff.emergencyContactAddress}>
                          {staff.emergencyContactAddress || "-"}
                        </td>
                      )}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
                    <>
                      {visibleColumns.scheduleType !== false && <td className="px-4 py-3 text-slate-600">{staff.scheduleType || "Fixed"}</td>}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
                    <>
                      {visibleColumns.smartphoneAttendance !== false && <td className="px-4 py-3 text-slate-600">{staff.smartphoneAttendance}</td>}
                      {visibleColumns.selfie !== false && <td className="px-4 py-3 text-slate-600">{staff.selfie}</td>}
                      {visibleColumns.qr !== false && <td className="px-4 py-3 text-slate-600">{staff.qr}</td>}
                      {visibleColumns.markFrom !== false && <td className="px-4 py-3 text-slate-600">{staff.markFrom}</td>}
                      {visibleColumns.biometric !== false && <td className="px-4 py-3 text-slate-600">{staff.biometric}</td>}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
                    <>
                      {visibleColumns.autoPresent !== false && <td className="px-4 py-3 text-slate-600">{staff.autoPresent}</td>}
                      {visibleColumns.presentOnPunchIn !== false && <td className="px-4 py-3 text-slate-600">{staff.presentOnPunchIn}</td>}
                      {visibleColumns.autoHalfDay !== false && <td className="px-4 py-3 text-slate-400">-</td>}
                      {visibleColumns.mandatoryHalfDayHours !== false && <td className="px-4 py-3 text-slate-400">-</td>}
                      {visibleColumns.mandatoryFullDayHours !== false && <td className="px-4 py-3 text-slate-400">-</td>}
                    </>
                  )}

                  {activeTab === "Bank Details" && (
                    <>
                      {visibleColumns.bankName !== false && <td className="px-4 py-3 font-medium text-slate-800">{staff.bankName}</td>}
                      {visibleColumns.bankAccount !== false && <td className="px-4 py-3 font-mono text-slate-600">{staff.bankAccount}</td>}
                      {visibleColumns.pennyDropStatus !== false && (
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Penny Drop Verified</span>
                          </span>
                        </td>
                      )}
                    </>
                  )}

                  {activeTab === "Salary Details" && (
                    <>
                      {visibleColumns.monthlyCtc !== false && (
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          ₹{staff.monthlyCtc?.toLocaleString("en-IN")} / mo
                        </td>
                      )}
                      {visibleColumns.basicPay !== false && (
                        <td className="px-4 py-3 text-slate-600">
                          ₹{Math.round((staff.monthlyCtc || 0) * 0.5).toLocaleString("en-IN")}
                        </td>
                      )}
                      {visibleColumns.hra !== false && <td className="px-4 py-3 text-slate-600">Standard 25% HRA</td>}
                      {visibleColumns.pfDeduction !== false && (
                        <td className="px-4 py-3 text-rose-600 font-semibold">
                          ₹{Math.round((staff.monthlyCtc || 0) * 0.5 * 0.12).toLocaleString("en-IN")}
                        </td>
                      )}
                      {visibleColumns.esi !== false && <td className="px-4 py-3 text-slate-600">₹200</td>}
                      {visibleColumns.netPay !== false && (
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          ₹{(
                            (staff.monthlyCtc || 0) -
                            Math.round((staff.monthlyCtc || 0) * 0.5 * 0.12) -
                            200
                          ).toLocaleString("en-IN")}
                        </td>
                      )}
                    </>
                  )}

                  {activeTab === "Leave Details" && (
                    <>
                      {visibleColumns.availableLeaves !== false && <td className="px-4 py-3 font-bold text-blue-600">{staff.leaveBalance} Days</td>}
                      {visibleColumns.leaveHistory !== false && <td className="px-4 py-3 text-slate-500">0 Used in 2026</td>}
                    </>
                  )}

                  {activeTab === "Penalty & Overtime" && (
                    <>
                      {visibleColumns.earlyLeaving !== false && <td className="px-4 py-3 text-slate-600">Grace 15 mins (Deduct 0.5 Day)</td>}
                      {visibleColumns.lateComing !== false && <td className="px-4 py-3 text-slate-600">Grace 15 mins (Deduct 0.5 Day)</td>}
                      {visibleColumns.overtime !== false && <td className="px-4 py-3 text-emerald-600 font-medium">1.5x Hourly Rate</td>}
                    </>
                  )}

                  {activeTab === "Permissions" && (
                    <>
                      {visibleColumns.role !== false && <td className="px-4 py-3 font-medium text-slate-800">Regular Employee</td>}
                      {visibleColumns.appAccess !== false && <td className="px-4 py-3 text-emerald-600 font-medium">Enabled</td>}
                      {visibleColumns.webAccess !== false && <td className="px-4 py-3 text-slate-500">Disabled</td>}
                    </>
                  )}

                  {activeTab === "Approval Flows" && (
                    <>
                      {visibleColumns.leaveApprover !== false && <td className="px-4 py-3 text-slate-700 font-medium">Reporting Manager</td>}
                      {visibleColumns.attendanceApprover !== false && <td className="px-4 py-3 text-slate-700 font-medium">Reporting Manager</td>}
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

      {/* 1:1 SalaryBox Mark Staff Active Modal */}
      {activatingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setActivatingStaff(null)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-lg shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4">
              <h3 className="text-base font-semibold text-slate-800">
                Mark {activatingStaff.name} Active
              </h3>
            </div>

            <div className="border-t border-slate-200" />

            {/* Modal Body */}
            <div className="px-6 py-6">
              <p className="text-sm text-slate-700 font-normal">
                Are you sure, you want to mark this staff Active ?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActivatingStaff(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setStaffList((prev) =>
                    prev.map((s) =>
                      s.id === activatingStaff.id ? { ...s, needsActivation: false } : s
                    )
                  );
                  setActivatingStaff(null);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Mark Staff Active
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}