"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
  UserCheck,
  Check,
  Building2,
  Clock,
  Smartphone,
  Shield,
  Layers
} from "lucide-react";
import { EmployeeDetailView } from "./EmployeeDetailView";

interface EmployeeItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  needsActivation?: boolean;
  jobTitle?: string;
  branch?: string;
  department?: string;
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

const BRANCH_OPTIONS = ["All Branches", "VIJAYAWADA", "Addanki", "HQ Bangalore", "Guntur"];
const DEPARTMENT_OPTIONS = ["All Departments", "Operations", "Technical", "Accounts", "Management"];

const INITIAL_STAFF: EmployeeItem[] = [
  {
    id: "2",
    name: "Bobba Prasad",
    initials: "BP",
    avatarColor: "bg-purple-500",
    jobTitle: "Technician",
    branch: "VIJAYAWADA",
    department: "Technical",
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
    jobTitle: "Operations Executive",
    branch: "VIJAYAWADA",
    department: "Operations",
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
    jobTitle: "Logistics Lead",
    branch: "VIJAYAWADA",
    department: "Operations",
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
    branch: "VIJAYAWADA",
    department: "Technical",
    verificationStatus: "Not Started",
    dateOfJoining: "01/05/2026",
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
    jobTitle: "Accountant",
    branch: "VIJAYAWADA",
    department: "Accounts",
    verificationStatus: "Not Started",
    dateOfJoining: "15/04/2026",
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
    branch: "VIJAYAWADA",
    department: "Management",
    verificationStatus: "Not Started",
    employeeType: "Permanent",
    dateOfJoining: "10/01/2026",
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
    jobTitle: "Field Technician",
    branch: "Addanki",
    department: "Technical",
    verificationStatus: "Not Started",
    dateOfJoining: "20/03/2026",
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
    branch: "VIJAYAWADA",
    department: "Technical",
    verificationStatus: "Not Started",
    employeeType: "Full Time",
    dateOfJoining: "12/02/2026",
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
    jobTitle: "Operations Trainee",
    branch: "HQ Bangalore",
    department: "Operations",
    verificationStatus: "Not Started",
    dateOfJoining: "01/08/2026",
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
    branch: "HQ Bangalore",
    department: "Management",
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
    jobTitle: "Junior Accountant",
    branch: "Guntur",
    department: "Accounts",
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
    jobTitle: "Field Coordinator",
    branch: "Addanki",
    department: "Operations",
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
    jobTitle: "Support Engineer",
    branch: "Guntur",
    department: "Technical",
    verificationStatus: "Not Started",
    dateOfJoining: "18/06/2026",
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
      { key: "branch", label: "Branch" },
      { key: "department", label: "Department" },
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
      return [{ key: "scheduleType", label: "Schedule Type" }];
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

  // Filter Dropdowns State
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  // Modals & Popovers State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShowFieldsOpen, setIsShowFieldsOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [activatingStaff, setActivatingStaff] = useState<EmployeeItem | null>(null);

  // Batch Update Modals
  const [isUpdateStaffModalOpen, setIsUpdateStaffModalOpen] = useState(false);
  const [isUpdateWorkTimingsModalOpen, setIsUpdateWorkTimingsModalOpen] = useState(false);
  const [isUpdateAttendanceModesModalOpen, setIsUpdateAttendanceModesModalOpen] = useState(false);
  const [isUpdateAutomationRulesModalOpen, setIsUpdateAutomationRulesModalOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // More Filters state (1:1 Screenshots Match)
  const [filterStaffStatus, setFilterStaffStatus] = useState("All Staff");
  const [filterGender, setFilterGender] = useState("All");
  const [filterEmployeeType, setFilterEmployeeType] = useState("All");

  const branchRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    jobTitle: true,
    branch: true,
    department: true,
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
    branch: "VIJAYAWADA",
    department: "Technical",
    dateOfJoining: new Date().toISOString().split("T")[0],
    employeeType: "Full Time",
    monthlyCtc: 30000,
  });

  // Batch Update State
  const [batchUpdateForm, setBatchUpdateForm] = useState({
    branch: "",
    department: "",
    jobTitle: "",
    employeeType: "",
    monthlyCtc: "",
    verificationStatus: "",
    scheduleType: "",
    smartphoneAttendance: "",
    selfie: "",
    qr: "",
    biometric: "",
    markFrom: "",
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
      branch: newStaff.branch || "VIJAYAWADA",
      department: newStaff.department || "Technical",
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
    showToast(`Added ${created.name} successfully!`);
  };

  const handleApplyBatchUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetIds = selectedStaff.length > 0 ? selectedStaff : activeStaffIds;

    setStaffList((prev) =>
      prev.map((staff) => {
        if (!targetIds.includes(staff.id)) return staff;

        const updated = { ...staff };
        if (batchUpdateForm.branch) updated.branch = batchUpdateForm.branch;
        if (batchUpdateForm.department) updated.department = batchUpdateForm.department;
        if (batchUpdateForm.jobTitle) updated.jobTitle = batchUpdateForm.jobTitle;
        if (batchUpdateForm.employeeType) updated.employeeType = batchUpdateForm.employeeType;
        if (batchUpdateForm.monthlyCtc) updated.monthlyCtc = Number(batchUpdateForm.monthlyCtc);
        if (batchUpdateForm.verificationStatus) updated.verificationStatus = batchUpdateForm.verificationStatus as any;
        if (batchUpdateForm.scheduleType) updated.scheduleType = batchUpdateForm.scheduleType;
        if (batchUpdateForm.smartphoneAttendance) updated.smartphoneAttendance = batchUpdateForm.smartphoneAttendance;
        if (batchUpdateForm.selfie) updated.selfie = batchUpdateForm.selfie;
        if (batchUpdateForm.qr) updated.qr = batchUpdateForm.qr;
        if (batchUpdateForm.biometric) updated.biometric = batchUpdateForm.biometric;
        if (batchUpdateForm.markFrom) updated.markFrom = batchUpdateForm.markFrom;

        return updated;
      })
    );

    setIsUpdateStaffModalOpen(false);
    setIsUpdateWorkTimingsModalOpen(false);
    setIsUpdateAttendanceModesModalOpen(false);
    setIsUpdateAutomationRulesModalOpen(false);
    showToast(`Updated ${targetIds.length} staff member${targetIds.length > 1 ? "s" : ""} successfully!`);
  };

  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<EmployeeItem | null>(null);

  const filteredStaff = staffList.filter((staff) => {
    // 1. Search Query
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.jobTitle && staff.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Branch Filter
    if (selectedBranch !== "All Branches") {
      if ((staff.branch || "VIJAYAWADA") !== selectedBranch) return false;
    }

    // 3. Department Filter
    if (selectedDepartment !== "All Departments") {
      if ((staff.department || "Technical") !== selectedDepartment) return false;
    }

    // 4. Staff Status Filter (All Staff / Active Staff / Inactive Staff)
    if (filterStaffStatus === "Active Staff" && staff.needsActivation) return false;
    if (filterStaffStatus === "Inactive Staff" && !staff.needsActivation) return false;

    // 5. Gender Filter (All / Male / Female / Others)
    if (filterGender !== "All") {
      if ((staff.gender || "Male") !== filterGender) return false;
    }

    // 6. Employee Type Filter (All / Full Time / Permanent / Part Time / Consultant / Temporary / Probation / Intern)
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
          showToast(`Saved updates for ${updated.name || "Employee"}!`);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

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
              className={`py-3 whitespace-nowrap transition-colors relative cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
          {/* Search Input */}
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

          {/* Interactive Branch Dropdown */}
          <div className="relative" ref={branchRef}>
            <button
              type="button"
              onClick={() => {
                setIsBranchDropdownOpen(!isBranchDropdownOpen);
                setIsDeptDropdownOpen(false);
                setIsMoreFiltersOpen(false);
                setIsShowFieldsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                selectedBranch !== "All Branches"
                  ? "bg-blue-50 text-blue-600 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>{selectedBranch}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isBranchDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                {BRANCH_OPTIONS.map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                      selectedBranch === branch
                        ? "bg-blue-50 text-[#007BFF] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 font-normal"
                    }`}
                  >
                    <span>{branch}</span>
                    {selectedBranch === branch && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Department Dropdown */}
          <div className="relative" ref={deptRef}>
            <button
              type="button"
              onClick={() => {
                setIsDeptDropdownOpen(!isDeptDropdownOpen);
                setIsBranchDropdownOpen(false);
                setIsMoreFiltersOpen(false);
                setIsShowFieldsOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                selectedDepartment !== "All Departments"
                  ? "bg-blue-50 text-blue-600 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>{selectedDepartment}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDeptDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDeptDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setIsDeptDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between transition-colors ${
                      selectedDepartment === dept
                        ? "bg-blue-50 text-[#007BFF] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 font-normal"
                    }`}
                  >
                    <span>{dept}</span>
                    {selectedDepartment === dept && <Check className="w-3.5 h-3.5 text-[#007BFF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More Filters Popover Button & Modal (1:1 Screenshot Match) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsMoreFiltersOpen(!isMoreFiltersOpen);
                setIsBranchDropdownOpen(false);
                setIsDeptDropdownOpen(false);
                setIsShowFieldsOpen(false);
              }}
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
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreFiltersOpen(false)}
                />

                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1.5">Staff Status</label>
                      <div className="relative">
                        <select
                          value={filterStaffStatus}
                          onChange={(e) => setFilterStaffStatus(e.target.value)}
                          className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option>All Staff</option>
                          <option>Active Staff</option>
                          <option>Inactive Staff</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1.5">Gender</label>
                      <div className="relative">
                        <select
                          value={filterGender}
                          onChange={(e) => setFilterGender(e.target.value)}
                          className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        >
                          <option>All</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Others</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1.5">Employee Type</label>
                      <div className="relative">
                        <select
                          value={filterEmployeeType}
                          onChange={(e) => setFilterEmployeeType(e.target.value)}
                          className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
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

                  <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setFilterStaffStatus("All Staff");
                        setFilterGender("All");
                        setFilterEmployeeType("All");
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      Reset
                    </button>
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
              onClick={() => {
                setIsShowFieldsOpen(!isShowFieldsOpen);
                setIsBranchDropdownOpen(false);
                setIsDeptDropdownOpen(false);
                setIsMoreFiltersOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#007BFF] bg-blue-50/50 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors cursor-pointer font-medium"
            >
              <Eye className="w-3.5 h-3.5 text-[#007BFF]" />
              <span>Show Fields</span>
            </button>

            {isShowFieldsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsShowFieldsOpen(false)}
                />

                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 ${getFieldsForCurrentTab(activeTab, activeSubTab).length > 4 ? "w-[520px]" : "w-[360px]"} bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-6 animate-in fade-in zoom-in-95 duration-150`}>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />

                  {(() => {
                    const fields = getFieldsForCurrentTab(activeTab, activeSubTab);
                    const midpoint = Math.ceil(fields.length / 2);
                    const col1 = fields.slice(0, midpoint);
                    const col2 = fields.slice(midpoint);

                    return (
                      <div className={`grid ${fields.length > 4 ? "grid-cols-2 gap-x-8" : "grid-cols-1"} gap-y-3.5 text-xs text-slate-800`}>
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

        {/* Action Buttons Right */}
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
                onClick={() => {
                  setBatchUpdateForm({
                    branch: "",
                    department: "",
                    jobTitle: "",
                    employeeType: "",
                    monthlyCtc: "",
                    verificationStatus: "",
                    scheduleType: "",
                    smartphoneAttendance: "",
                    selfie: "",
                    qr: "",
                    biometric: "",
                    markFrom: "",
                  });
                  setIsUpdateStaffModalOpen(true);
                }}
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
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => setIsUpdateWorkTimingsModalOpen(true)}
            >
              Update Work Timings
            </button>
          )}

          {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => setIsUpdateAttendanceModesModalOpen(true)}
            >
              Update Attendance Modes
            </button>
          )}

          {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
            <button
              className="px-3 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => setIsUpdateAutomationRulesModalOpen(true)}
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
                  {visibleColumns.branch && <th className="px-4 py-3">BRANCH</th>}
                  {visibleColumns.department && <th className="px-4 py-3">DEPARTMENT</th>}
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
                      <button
                        onClick={() => setSelectedEmployeeForDetail(staff)}
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer truncate text-left"
                      >
                        {staff.name}
                      </button>
                      {staff.needsActivation && (
                        <button
                          onClick={() => setActivatingStaff(staff)}
                          className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-white border border-blue-400 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>

                  {activeTab === "Staff Details" && (
                    <>
                      {visibleColumns.jobTitle && <td className="px-4 py-3 text-slate-600">{staff.jobTitle || "-"}</td>}
                      {visibleColumns.branch && <td className="px-4 py-3 text-slate-600">{staff.branch || "VIJAYAWADA"}</td>}
                      {visibleColumns.department && <td className="px-4 py-3 text-slate-600">{staff.department || "Technical"}</td>}
                      {visibleColumns.verificationStatus && (
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-red-600 font-semibold text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            {staff.verificationStatus}
                          </span>
                        </td>
                      )}
                      {visibleColumns.employeeId && <td className="px-4 py-3 text-slate-400">{staff.employeeId || "-"}</td>}
                      {visibleColumns.employeeType && (
                        <td className="px-4 py-3 text-slate-600">{staff.employeeType || "Full Time"}</td>
                      )}
                      {visibleColumns.dateOfJoining && (
                        <td className="px-4 py-3 text-slate-600">{staff.dateOfJoining || "-"}</td>
                      )}
                      {visibleColumns.dateOfLeaving && (
                        <td className="px-4 py-3 text-slate-400">{staff.dateOfLeaving || "-"}</td>
                      )}
                      {visibleColumns.dateOfBirth && (
                        <td className="px-4 py-3 text-slate-400">{staff.dateOfBirth || "-"}</td>
                      )}
                      {visibleColumns.mobileNumber && (
                        <td className="px-4 py-3 text-slate-400">{staff.mobileNumber || "-"}</td>
                      )}
                      {visibleColumns.personalEmail && (
                        <td className="px-4 py-3 text-slate-400">{staff.personalEmail || "-"}</td>
                      )}
                      {visibleColumns.officialEmail && (
                        <td className="px-4 py-3 text-slate-400">{staff.officialEmail || "-"}</td>
                      )}
                      {visibleColumns.maritalStatus && (
                        <td className="px-4 py-3 text-slate-400">{staff.maritalStatus || "-"}</td>
                      )}
                      {visibleColumns.gender && <td className="px-4 py-3 text-slate-400">{staff.gender || "Male"}</td>}
                      {visibleColumns.bloodGroup && (
                        <td className="px-4 py-3 text-slate-400">{staff.bloodGroup || "-"}</td>
                      )}
                      {visibleColumns.currentAddress && (
                        <td className="px-4 py-3 text-slate-400">{staff.currentAddress || "-"}</td>
                      )}
                      {visibleColumns.permanentAddress && (
                        <td className="px-4 py-3 text-slate-400">{staff.permanentAddress || "-"}</td>
                      )}
                      {visibleColumns.aadhaar && <td className="px-4 py-3 text-slate-400">{staff.aadhaar || "-"}</td>}
                      {visibleColumns.pan && <td className="px-4 py-3 text-slate-400">{staff.pan || "-"}</td>}
                      {visibleColumns.uan && <td className="px-4 py-3 text-slate-400">{staff.uan || "-"}</td>}
                      {visibleColumns.pfAccountNo && (
                        <td className="px-4 py-3 text-slate-400">{staff.pfAccountNo || "-"}</td>
                      )}
                      {visibleColumns.esiAccountNo && (
                        <td className="px-4 py-3 text-slate-400">{staff.esiAccountNo || "-"}</td>
                      )}
                      {visibleColumns.drivingLicense && (
                        <td className="px-4 py-3 text-slate-400">{staff.drivingLicense || "-"}</td>
                      )}
                      {visibleColumns.voterId && <td className="px-4 py-3 text-slate-400">{staff.voterId || "-"}</td>}
                      {visibleColumns.guardianName && (
                        <td className="px-4 py-3 text-slate-400">{staff.guardianName || "-"}</td>
                      )}
                      {visibleColumns.emergencyContactName && (
                        <td className="px-4 py-3 text-slate-400">{staff.emergencyContactName || "-"}</td>
                      )}
                      {visibleColumns.emergencyContactPhone && (
                        <td className="px-4 py-3 text-slate-400">{staff.emergencyContactPhone || "-"}</td>
                      )}
                      {visibleColumns.emergencyContactRelationship && (
                        <td className="px-4 py-3 text-slate-400">{staff.emergencyContactRelationship || "-"}</td>
                      )}
                      {visibleColumns.emergencyContactAddress && (
                        <td className="px-4 py-3 text-slate-400">{staff.emergencyContactAddress || "-"}</td>
                      )}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Work Timings" && (
                    <>
                      {visibleColumns.scheduleType !== false && (
                        <td className="px-4 py-3 text-slate-600 font-medium">{staff.scheduleType || "Fixed"}</td>
                      )}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Attendance Modes" && (
                    <>
                      {visibleColumns.smartphoneAttendance !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.smartphoneAttendance || "Yes"}</td>
                      )}
                      {visibleColumns.selfie !== false && <td className="px-4 py-3 text-slate-600">{staff.selfie || "Yes"}</td>}
                      {visibleColumns.qr !== false && <td className="px-4 py-3 text-slate-600">{staff.qr || "No"}</td>}
                      {visibleColumns.markFrom !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.markFrom || "Office"}</td>
                      )}
                      {visibleColumns.biometric !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.biometric || "No"}</td>
                      )}
                    </>
                  )}

                  {activeTab === "Attendance Details" && activeSubTab === "Automation Rules" && (
                    <>
                      {visibleColumns.autoPresent !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.autoPresent || "No"}</td>
                      )}
                      {visibleColumns.presentOnPunchIn !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.presentOnPunchIn || "No"}</td>
                      )}
                      {visibleColumns.autoHalfDay !== false && <td className="px-4 py-3 text-slate-600">No</td>}
                      {visibleColumns.mandatoryHalfDayHours !== false && (
                        <td className="px-4 py-3 text-slate-600">4 Hours</td>
                      )}
                      {visibleColumns.mandatoryFullDayHours !== false && (
                        <td className="px-4 py-3 text-slate-600">8 Hours</td>
                      )}
                    </>
                  )}

                  {activeTab === "Bank Details" && (
                    <>
                      {visibleColumns.bankName !== false && (
                        <td className="px-4 py-3 text-slate-700 font-medium">{staff.bankName || "-"}</td>
                      )}
                      {visibleColumns.bankAccount !== false && (
                        <td className="px-4 py-3 text-slate-600">{staff.bankAccount || "-"}</td>
                      )}
                      {visibleColumns.pennyDropStatus !== false && (
                        <td className="px-4 py-3 text-emerald-600 font-medium">Verified</td>
                      )}
                    </>
                  )}

                  {activeTab === "Salary Details" && (
                    <>
                      {visibleColumns.monthlyCtc !== false && (
                        <td className="px-4 py-3 text-slate-800 font-semibold">
                          ₹{staff.monthlyCtc?.toLocaleString() || "30,000"}
                        </td>
                      )}
                      {visibleColumns.basicPay !== false && (
                        <td className="px-4 py-3 text-slate-600">
                          ₹{((staff.monthlyCtc || 30000) * 0.5).toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.hra !== false && (
                        <td className="px-4 py-3 text-slate-600">
                          ₹{((staff.monthlyCtc || 30000) * 0.25).toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.pfDeduction !== false && (
                        <td className="px-4 py-3 text-slate-600">
                          ₹{((staff.monthlyCtc || 30000) * 0.12).toLocaleString()}
                        </td>
                      )}
                      {visibleColumns.esi !== false && <td className="px-4 py-3 text-slate-600">₹0</td>}
                      {visibleColumns.netPay !== false && (
                        <td className="px-4 py-3 text-emerald-600 font-semibold">
                          ₹{((staff.monthlyCtc || 30000) * 0.88).toLocaleString()}
                        </td>
                      )}
                    </>
                  )}

                  {activeTab === "Leave Details" && (
                    <>
                      {visibleColumns.availableLeaves !== false && (
                        <td className="px-4 py-3 text-blue-600 font-semibold">{staff.leaveBalance || 12} Days</td>
                      )}
                      {visibleColumns.leaveHistory !== false && (
                        <td className="px-4 py-3 text-slate-500">View (0)</td>
                      )}
                    </>
                  )}

                  {activeTab === "Penalty & Overtime" && (
                    <>
                      {visibleColumns.earlyLeaving !== false && (
                        <td className="px-4 py-3 text-slate-600">Default (Grace 15 mins)</td>
                      )}
                      {visibleColumns.lateComing !== false && (
                        <td className="px-4 py-3 text-slate-600">Default (Grace 15 mins)</td>
                      )}
                      {visibleColumns.overtime !== false && (
                        <td className="px-4 py-3 text-slate-600">1.5x Hourly Rate</td>
                      )}
                    </>
                  )}

                  {activeTab === "Permissions" && (
                    <>
                      {visibleColumns.role !== false && (
                        <td className="px-4 py-3 text-slate-700 font-medium">Employee</td>
                      )}
                      {visibleColumns.appAccess !== false && (
                        <td className="px-4 py-3 text-emerald-600 font-semibold">Enabled</td>
                      )}
                      {visibleColumns.webAccess !== false && (
                        <td className="px-4 py-3 text-slate-500">Disabled</td>
                      )}
                    </>
                  )}

                  {activeTab === "Approval Flows" && (
                    <>
                      {visibleColumns.leaveApprover !== false && (
                        <td className="px-4 py-3 text-slate-600">Admin / Manager</td>
                      )}
                      {visibleColumns.attendanceApprover !== false && (
                        <td className="px-4 py-3 text-slate-600">Admin / Manager</td>
                      )}
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 6. Modals */}

      {/* A. Batch Update Staff Modal */}
      {isUpdateStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Update Staff Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedStaff.length > 0
                    ? `Applying changes to ${selectedStaff.length} selected staff member${selectedStaff.length > 1 ? "s" : ""}`
                    : `Applying changes to all ${activeStaffIds.length} active staff members`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateStaffModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyBatchUpdate} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={batchUpdateForm.branch}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, branch: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Leave Unchanged --</option>
                    <option value="VIJAYAWADA">VIJAYAWADA</option>
                    <option value="Addanki">Addanki</option>
                    <option value="HQ Bangalore">HQ Bangalore</option>
                    <option value="Guntur">Guntur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={batchUpdateForm.department}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, department: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Leave Unchanged --</option>
                    <option value="Operations">Operations</option>
                    <option value="Technical">Technical</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Technician"
                    value={batchUpdateForm.jobTitle}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, jobTitle: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Type</label>
                  <select
                    value={batchUpdateForm.employeeType}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, employeeType: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Leave Unchanged --</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Probation">Probation</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly CTC (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 35000"
                    value={batchUpdateForm.monthlyCtc}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, monthlyCtc: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Schedule Type</label>
                  <select
                    value={batchUpdateForm.scheduleType}
                    onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, scheduleType: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Leave Unchanged --</option>
                    <option value="Fixed">Fixed Schedule</option>
                    <option value="Flexible">Flexible Schedule</option>
                    <option value="Rotational">Rotational Shifts</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateStaffModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md font-semibold shadow-xs transition-colors"
                >
                  Apply Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. Update Work Timings Modal */}
      {isUpdateWorkTimingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Update Work Timings</h3>
              <button
                type="button"
                onClick={() => setIsUpdateWorkTimingsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyBatchUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Schedule Type</label>
                <select
                  value={batchUpdateForm.scheduleType}
                  onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, scheduleType: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Fixed">Fixed Schedule (09:00 AM - 06:30 PM)</option>
                  <option value="Flexible">Flexible Schedule (9 Hours / day)</option>
                  <option value="Rotational">Rotational Shift</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateWorkTimingsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md font-semibold shadow-xs"
                >
                  Save Timings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Update Attendance Modes Modal */}
      {isUpdateAttendanceModesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Update Attendance Modes</h3>
              <button
                type="button"
                onClick={() => setIsUpdateAttendanceModesModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyBatchUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Smartphone Attendance</label>
                <select
                  value={batchUpdateForm.smartphoneAttendance}
                  onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, smartphoneAttendance: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Yes">Yes (Allow punch from app)</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selfie Verification</label>
                <select
                  value={batchUpdateForm.selfie}
                  onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, selfie: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Yes">Yes (Mandatory Selfie on punch)</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mark Attendance From</label>
                <select
                  value={batchUpdateForm.markFrom}
                  onChange={(e) => setBatchUpdateForm({ ...batchUpdateForm, markFrom: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Office">Office Geofence Radius Only</option>
                  <option value="Anywhere">Anywhere (Field / Remote)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateAttendanceModesModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md font-semibold shadow-xs"
                >
                  Save Modes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. Update Automation Rules Modal */}
      {isUpdateAutomationRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Update Automation Rules</h3>
              <button
                type="button"
                onClick={() => setIsUpdateAutomationRulesModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyBatchUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auto Present at Day Start</label>
                <select className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="No">No (Require explicit punch)</option>
                  <option value="Yes">Yes (Auto mark present)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Present on Punch In</label>
                <select className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="No">No</option>
                  <option value="Yes">Yes (Mark present immediately)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUpdateAutomationRulesModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md font-semibold shadow-xs"
                >
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add New Staff</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Technician"
                    value={newStaff.jobTitle}
                    onChange={(e) => setNewStaff({ ...newStaff, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={newStaff.branch}
                    onChange={(e) => setNewStaff({ ...newStaff, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="VIJAYAWADA">VIJAYAWADA</option>
                    <option value="Addanki">Addanki</option>
                    <option value="HQ Bangalore">HQ Bangalore</option>
                    <option value="Guntur">Guntur</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Operations">Operations</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    value={newStaff.dateOfJoining}
                    onChange={(e) => setNewStaff({ ...newStaff, dateOfJoining: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly CTC (₹)</label>
                  <input
                    type="number"
                    value={newStaff.monthlyCtc}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlyCtc: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* F. Mark Staff Active Modal */}
      {activatingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setActivatingStaff(null)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-lg shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4">
              <h3 className="text-base font-semibold text-slate-800">
                Mark {activatingStaff.name} Active
              </h3>
            </div>

            <div className="border-t border-slate-200" />

            <div className="px-6 py-6 space-y-3">
              <p className="text-sm text-slate-700 font-normal">
                Are you sure, you want to mark this staff Active?
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Assign Branch</label>
                  <select
                    defaultValue={activatingStaff.branch || "VIJAYAWADA"}
                    id="active-branch-select"
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded-md"
                  >
                    <option value="VIJAYAWADA">VIJAYAWADA</option>
                    <option value="Addanki">Addanki</option>
                    <option value="HQ Bangalore">HQ Bangalore</option>
                    <option value="Guntur">Guntur</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Assign Department</label>
                  <select
                    defaultValue={activatingStaff.department || "Operations"}
                    id="active-dept-select"
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded-md"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Technical">Technical</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>
            </div>

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
                  const bSelect = document.getElementById("active-branch-select") as HTMLSelectElement;
                  const dSelect = document.getElementById("active-dept-select") as HTMLSelectElement;
                  const assignedBranch = bSelect?.value || activatingStaff.branch || "VIJAYAWADA";
                  const assignedDept = dSelect?.value || activatingStaff.department || "Operations";

                  setStaffList((prev) =>
                    prev.map((s) =>
                      s.id === activatingStaff.id
                        ? { ...s, needsActivation: false, branch: assignedBranch, department: assignedDept }
                        : s
                    )
                  );
                  setActivatingStaff(null);
                  showToast(`Activated ${activatingStaff.name} successfully!`);
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