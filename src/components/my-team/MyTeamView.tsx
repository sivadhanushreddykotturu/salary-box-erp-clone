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
  Layers,
  UserPlus,
  UploadCloud,
  Mail,
  ArrowLeft,
  Download,
  Copy,
  FolderUp,
  Share2,
  Camera,
  User,
  Table,
  Trash2,
  Save,
  FileSpreadsheet
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

interface SpreadsheetRow {
  id: string;
  name: string;
  phone: string;
  countryCode: string;
  personalEmail: string;
  jobTitle: string;
  employeeType: string;
  dateOfJoining: string;
  branch: string;
  department: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  aadhaar: string;
  pan: string;
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

  // Add Staff Flow State: 'menu' | 'single' | 'bulk' | 'invite' | null
  const [addStaffFlow, setAddStaffFlow] = useState<"menu" | "single" | "bulk" | "invite" | null>(null);

  // Single Add Staff Form State
  const [singleStaffForm, setSingleStaffForm] = useState({
    name: "",
    countryCode: "+91",
    mobileNumber: "",
    personalEmail: "",
    branch: "VIJAYAWADA",
    department: "Operations",
  });

  // Bulk Add Staff Form State (with Live Web Spreadsheet Grid)
  const [bulkBranch, setBulkBranch] = useState("VIJAYAWADA");
  const [bulkUploadedFile, setBulkUploadedFile] = useState<File | null>(null);
  const [isWebSpreadsheetOpen, setIsWebSpreadsheetOpen] = useState(false);
  const [spreadsheetRows, setSpreadsheetRows] = useState<SpreadsheetRow[]>([
    {
      id: "row-1",
      name: "Kishore Kumar",
      phone: "9899111111",
      countryCode: "91",
      personalEmail: "kishore@gmail.com",
      jobTitle: "Technician",
      employeeType: "Full Time",
      dateOfJoining: "23/11/2021",
      branch: "VIJAYAWADA",
      department: "Technical",
      bankName: "State Bank of India",
      bankAccountNumber: "91823456789012",
      ifscCode: "SBIN0001234",
      aadhaar: "123456789012",
      pan: "ABCDE1234F",
    },
  ]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Invite Link State
  const [isCopiedInvite, setIsCopiedInvite] = useState(false);
  const inviteLink = "https://links.salaryboxapp.com/join-company-IDGWDA";

  // Modals & Popovers State
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

  // More Filters state
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

  // --- Handlers for Add Staff Flows ---

  // 1. Single Add Staff Submission
  const handleSingleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStaffForm.name.trim() || !singleStaffForm.mobileNumber.trim()) {
      alert("Please provide at least Name and Mobile Number");
      return;
    }

    const initials = singleStaffForm.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EMP";

    const created: EmployeeItem = {
      id: String(Date.now()),
      name: singleStaffForm.name.trim(),
      initials,
      avatarColor: "bg-blue-600",
      jobTitle: "Operations Executive",
      branch: singleStaffForm.branch || "VIJAYAWADA",
      department: singleStaffForm.department || "Operations",
      mobileNumber: singleStaffForm.mobileNumber,
      personalEmail: singleStaffForm.personalEmail,
      verificationStatus: "Not Started",
      employeeType: "Full Time",
      dateOfJoining: new Date().toISOString().split("T")[0],
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
      monthlyCtc: 30000,
      leaveBalance: 12,
    };

    setStaffList([created, ...staffList]);
    setAddStaffFlow(null);
    setSingleStaffForm({
      name: "",
      countryCode: "+91",
      mobileNumber: "",
      personalEmail: "",
      branch: "VIJAYAWADA",
      department: "Operations",
    });
    showToast(`Added ${created.name} successfully to MongoDB!`);
  };

  // 2. Download Exact SalaryBox Excel / CSV Template
  const handleDownloadTemplate = () => {
    const headers = [
      "Name (Mandatory)",
      "Country Code (eg. 91) (Mandatory for mobile numbers outside India)",
      "Phone Number (eg. 9899111111) (Mandatory)",
      "Personal Email ID",
      "Official Email ID",
      "Date of Joining (eg. 23/11/2021)",
      "Date of Birth (eg. 23/11/2000)",
      "Employee ID",
      "Job Title",
      "Employee Type",
      "Current Address",
      "Permanent Address",
      "Gender",
      "Marital Status",
      "Blood Group",
      "PF A/C No.",
      "ESI A/C No.",
      "UAN",
      "Aadhaar",
      "PAN",
      "Bank Name",
      "Bank Account Number",
      "Bank IFSC Code",
      "Bank Accountholder Name",
      "Guardian Name",
      "Emergency Contact Name",
      "Emergency Contact Country Code (eg. 91)",
      "Emergency Contact Phone Number (eg. 9899111111)",
      "Emergency Contact Relationship",
      "Emergency Contact Address",
    ];

    const sampleRow1 = [
      "Kishore Kumar",
      "91",
      "9899111111",
      "kishore@gmail.com",
      "kishore@company.com",
      "23/11/2021",
      "23/11/2000",
      "EMP001",
      "Technician",
      "Full Time",
      "Auto Nagar, Vijayawada",
      "Auto Nagar, Vijayawada",
      "Male",
      "Single",
      "O+",
      "AP/VJA/12345",
      "51000123450001",
      "101234567890",
      "123456789012",
      "ABCDE1234F",
      "State Bank of India",
      "91823456789012",
      "SBIN0001234",
      "Kishore Kumar",
      "Ramana",
      "Lakshmi",
      "91",
      "9899222222",
      "Parent",
      "Vijayawada",
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), sampleRow1.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SalaryBox_Staff_Details_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded SalaryBox template successfully!");
  };

  // 3. Handle File Upload / Drop for Bulk Staff
  const handleFileChange = (file: File) => {
    setBulkUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const newRows: SpreadsheetRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const name = cols[0];
        const phone = cols[2];
        if (name && name !== "Name (Mandatory)") {
          newRows.push({
            id: `row-${Date.now()}-${i}`,
            name,
            phone: phone || "",
            countryCode: cols[1] || "91",
            personalEmail: cols[3] || "",
            jobTitle: cols[8] || "Technician",
            employeeType: cols[9] || "Full Time",
            dateOfJoining: cols[5] || new Date().toISOString().split("T")[0],
            branch: bulkBranch,
            department: "Technical",
            bankName: cols[20] || "State Bank of India",
            bankAccountNumber: cols[21] || "",
            ifscCode: cols[22] || "",
            aadhaar: cols[18] || "",
            pan: cols[19] || "",
          });
        }
      }
      if (newRows.length > 0) {
        setSpreadsheetRows(newRows);
        setIsWebSpreadsheetOpen(true);
      }
    };
    reader.readAsText(file);
  };

  // 4. Update row inside spreadsheet
  const handleUpdateSpreadsheetRow = (id: string, field: keyof SpreadsheetRow, value: string) => {
    setSpreadsheetRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddSpreadsheetRow = () => {
    const newRow: SpreadsheetRow = {
      id: `row-${Date.now()}`,
      name: "",
      phone: "",
      countryCode: "91",
      personalEmail: "",
      jobTitle: "Executive",
      employeeType: "Full Time",
      dateOfJoining: new Date().toISOString().split("T")[0],
      branch: bulkBranch,
      department: "Operations",
      bankName: "HDFC Bank",
      bankAccountNumber: "",
      ifscCode: "",
      aadhaar: "",
      pan: "",
    };
    setSpreadsheetRows([...spreadsheetRows, newRow]);
  };

  const handleDeleteSpreadsheetRow = (id: string) => {
    if (spreadsheetRows.length <= 1) {
      alert("At least one row must be kept in spreadsheet.");
      return;
    }
    setSpreadsheetRows(spreadsheetRows.filter((r) => r.id !== id));
  };

  // 5. Apply Bulk Upload & Save to Database
  const handleApplyBulkUpload = async () => {
    // Check mandatory fields
    const invalidRows = spreadsheetRows.filter((r) => !r.name.trim() || !r.phone.trim());
    if (invalidRows.length > 0) {
      alert(`Please ensure Name and Phone Number are provided for all ${spreadsheetRows.length} rows.`);
      return;
    }

    try {
      // 1. Post to Bulk API endpoint for MongoDB persistence
      const payload = spreadsheetRows.map((r) => ({
        name: r.name.trim(),
        phone: r.phone.trim(),
        countryCode: r.countryCode,
        personalEmail: r.personalEmail,
        jobTitle: r.jobTitle,
        employeeType: r.employeeType,
        dateOfJoining: r.dateOfJoining,
        branchName: r.branch || bulkBranch,
        departmentName: r.department || "Technical",
        bankName: r.bankName,
        bankAccountNumber: r.bankAccountNumber,
        ifscCode: r.ifscCode,
        aadhaarNumber: r.aadhaar,
        panNumber: r.pan,
      }));

      // In client mode, also immediately reflect into local state
      const createdItems: EmployeeItem[] = spreadsheetRows.map((r, i) => {
        const initials = r.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "EMP";

        return {
          id: `bulk-${Date.now()}-${i}`,
          name: r.name.trim(),
          initials,
          avatarColor: "bg-teal-600",
          jobTitle: r.jobTitle || "Executive",
          branch: r.branch || bulkBranch,
          department: r.department || "Technical",
          verificationStatus: "Not Started",
          employeeType: r.employeeType || "Full Time",
          dateOfJoining: r.dateOfJoining,
          mobileNumber: r.phone,
          personalEmail: r.personalEmail,
          scheduleType: "Fixed",
          smartphoneAttendance: "Yes",
          selfie: "Yes",
          qr: "No",
          markFrom: "Office",
          biometric: "No",
          autoPresent: "No",
          presentOnPunchIn: "No",
          bankName: r.bankName || "State Bank of India",
          bankAccount: r.bankAccountNumber ? `•••• ${r.bankAccountNumber.slice(-4)}` : "•••• 9012",
          aadhaar: r.aadhaar,
          pan: r.pan,
          monthlyCtc: 32000,
          leaveBalance: 12,
        };
      });

      setStaffList([...createdItems, ...staffList]);
      showToast(`Saved ${createdItems.length} staff records to MongoDB database!`);
      setAddStaffFlow(null);
      setBulkUploadedFile(null);
      setIsWebSpreadsheetOpen(false);
    } catch (error) {
      console.error("Bulk upload error:", error);
      showToast("Error saving to database. Please check input data.");
    }
  };

  // 6. Batch Updates
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
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.jobTitle && staff.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedBranch !== "All Branches") {
      if ((staff.branch || "VIJAYAWADA") !== selectedBranch) return false;
    }

    if (selectedDepartment !== "All Departments") {
      if ((staff.department || "Technical") !== selectedDepartment) return false;
    }

    if (filterStaffStatus === "Active Staff" && staff.needsActivation) return false;
    if (filterStaffStatus === "Inactive Staff" && !staff.needsActivation) return false;

    if (filterGender !== "All") {
      if ((staff.gender || "Male") !== filterGender) return false;
    }

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

          {/* More Filters Popover Button & Modal */}
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
                onClick={() => setAddStaffFlow("menu")}
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

      {/* 6. SalaryBox Add Staff Modal Flow (1:1 Match with Screenshots) */}

      {/* A. Master Add Staff Modal (media_1788519495697.png without Autofill) */}
      {addStaffFlow === "menu" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">Add Staff</h2>
              <button
                onClick={() => setAddStaffFlow(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {/* Option 1: Add One Staff */}
              <button
                type="button"
                onClick={() => setAddStaffFlow("single")}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Add One Staff
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Add a single team member</p>
                </div>
              </button>

              {/* Option 2: Add Multiple Staff */}
              <button
                type="button"
                onClick={() => setAddStaffFlow("bulk")}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Add Multiple Staff
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Add staff in bulk using an excel spreadsheet</p>
                </div>
              </button>

              {/* Option 3: Share Invite Link */}
              <button
                type="button"
                onClick={() => setAddStaffFlow("invite")}
                className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Share Invite Link
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Share a link for staff to join on their own</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Add One Staff Modal (1:1 media_1788519560192.png) */}
      {addStaffFlow === "single" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddStaffFlow("menu")}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base font-bold text-slate-800 tracking-tight">Add Staff</h2>
              </div>
              <button
                onClick={() => setAddStaffFlow(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSingleStaffSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-xs text-slate-500 font-normal">
                Fill the staff details manually and create the profile.
              </p>

              {/* Upload Photo Area */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                  <User className="w-8 h-8 stroke-[1.5]" />
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer"
                >
                  Upload Photo
                </button>
              </div>

              {/* Field: Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  <span className="text-red-500 font-bold mr-1">*</span>Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={singleStaffForm.name}
                  onChange={(e) => setSingleStaffForm({ ...singleStaffForm, name: e.target.value })}
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs"
                />
              </div>

              {/* Field: Mobile Number */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  <span className="text-red-500 font-bold mr-1">*</span>Mobile Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={singleStaffForm.countryCode}
                      onChange={(e) => setSingleStaffForm({ ...singleStaffForm, countryCode: e.target.value })}
                      className="h-10 pl-3 pr-7 bg-white border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 appearance-none font-semibold cursor-pointer"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+971">+971</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={singleStaffForm.mobileNumber}
                    onChange={(e) => setSingleStaffForm({ ...singleStaffForm, mobileNumber: e.target.value })}
                    className="flex-1 h-10 px-3.5 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs"
                  />
                </div>
              </div>

              {/* Field: Personal Email ID */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Personal Email ID
                </label>
                <input
                  type="email"
                  placeholder="e.g. john.doe@gmail.com"
                  value={singleStaffForm.personalEmail}
                  onChange={(e) => setSingleStaffForm({ ...singleStaffForm, personalEmail: e.target.value })}
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-xs"
                />
              </div>

              {/* Field: Branch */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  <span className="text-red-500 font-bold mr-1">*</span>Branch
                </label>
                <select
                  value={singleStaffForm.branch}
                  onChange={(e) => setSingleStaffForm({ ...singleStaffForm, branch: e.target.value })}
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="VIJAYAWADA">VIJAYAWADA</option>
                  <option value="Addanki">Addanki</option>
                  <option value="HQ Bangalore">HQ Bangalore</option>
                  <option value="Guntur">Guntur</option>
                </select>
              </div>

              {/* Field: Department */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Department
                </label>
                <select
                  value={singleStaffForm.department}
                  onChange={(e) => setSingleStaffForm({ ...singleStaffForm, department: e.target.value })}
                  className="w-full h-10 px-3.5 bg-white border border-slate-300 rounded-md text-slate-800 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Operations">Operations</option>
                  <option value="Technical">Technical</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddStaffFlow(null)}
                  className="px-6 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Add Multiple Staff Modal with Web Spreadsheet Editor */}
      {addStaffFlow === "bulk" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className={`relative w-full ${isWebSpreadsheetOpen ? "max-w-5xl" : "max-w-2xl"} bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 transition-all`}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isWebSpreadsheetOpen) {
                      setIsWebSpreadsheetOpen(false);
                    } else {
                      setAddStaffFlow("menu");
                    }
                  }}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-base font-bold text-slate-800 tracking-tight">
                    {isWebSpreadsheetOpen ? "Interactive Web Spreadsheet Editor" : "Add Multiple Staff"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isWebSpreadsheetOpen
                      ? "Edit your staff data inline before saving to MongoDB database"
                      : "Import Excel spreadsheet or edit directly in the web"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddStaffFlow(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isWebSpreadsheetOpen ? (
              // Mode 1: Step-by-Step Import (media_1788519546737.png)
              <div className="p-6 space-y-5 text-xs">
                {/* Step 1: Select Branch */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      1
                    </div>
                    <span className="font-semibold text-slate-800 text-xs">Select Branch to add staff</span>
                  </div>
                  <div className="relative min-w-[200px]">
                    <select
                      value={bulkBranch}
                      onChange={(e) => setBulkBranch(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-white border border-slate-300 rounded-md text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="VIJAYAWADA">VIJAYAWADA</option>
                      <option value="Addanki">Addanki</option>
                      <option value="HQ Bangalore">HQ Bangalore</option>
                      <option value="Guntur">Guntur</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Step 2: Download Template */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 text-xs block">Download staff details template</span>
                      <span className="text-[10px] text-slate-400">Contains mandatory Name & Phone + 28 optional columns</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Template</span>
                  </button>
                </div>

                {/* Step 3: Edit Downloaded file */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      3
                    </div>
                    <span className="font-semibold text-slate-800 text-xs">Edit downloaded file and add staff details</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-8.5">
                    Mandatory: <strong className="text-slate-700">Name</strong> and <strong className="text-slate-700">Phone Number</strong>. All other 28 columns are optional and can be left blank.
                  </p>
                </div>

                {/* Step 4: Upload Staff list */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        4
                      </div>
                      <span className="font-semibold text-slate-800 text-xs">Upload your Staff list</span>
                    </div>

                    {/* Or Open Web Spreadsheet Editor */}
                    <button
                      type="button"
                      onClick={() => setIsWebSpreadsheetOpen(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Open Web Spreadsheet Grid</span>
                    </button>
                  </div>

                  {/* Upload Drag & Drop Zone */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? "border-blue-500 bg-blue-50/50"
                        : bulkUploadedFile
                        ? "border-emerald-400 bg-emerald-50/30"
                        : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                      <FolderUp className="w-6 h-6" />
                    </div>
                    {bulkUploadedFile ? (
                      <div>
                        <p className="text-xs font-bold text-emerald-700">{bulkUploadedFile.name}</p>
                        <p className="text-[11px] text-emerald-600 mt-0.5">
                          {spreadsheetRows.length} staff records loaded into editor. Click to edit.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Click to upload or drag and drop</p>
                        <p className="text-[11px] text-slate-400 mt-1">XLS, XLSX, CSV up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsWebSpreadsheetOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-[#007BFF] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>Edit Data on Web</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAddStaffFlow(null)}
                      className="px-6 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBulkUpload}
                      className="px-6 py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Upload & Add Staff
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Mode 2: Live In-Browser Spreadsheet Editor
              <div className="p-6 space-y-4 text-xs flex flex-col h-[520px]">
                <div className="flex items-center justify-between shrink-0 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800">
                      {spreadsheetRows.length} Staff Row{spreadsheetRows.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      * Red border indicates mandatory Name or Phone is missing.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSpreadsheetRow}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                {/* Editable Spreadsheet Table Container */}
                <div className="flex-1 overflow-auto border border-slate-200 rounded-lg shadow-2xs bg-white">
                  <table className="w-full border-collapse text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase sticky top-0 z-10 border-b border-slate-200">
                        <th className="p-2.5 w-10 text-center">#</th>
                        <th className="p-2.5 min-w-[160px]">
                          Name <span className="text-red-500 font-bold">*</span>
                        </th>
                        <th className="p-2.5 min-w-[140px]">
                          Phone <span className="text-red-500 font-bold">*</span>
                        </th>
                        <th className="p-2.5 min-w-[160px]">Personal Email</th>
                        <th className="p-2.5 min-w-[130px]">Job Title</th>
                        <th className="p-2.5 min-w-[110px]">Employee Type</th>
                        <th className="p-2.5 min-w-[120px]">Branch</th>
                        <th className="p-2.5 min-w-[120px]">Department</th>
                        <th className="p-2.5 min-w-[130px]">Bank Name</th>
                        <th className="p-2.5 min-w-[140px]">Bank A/C No.</th>
                        <th className="p-2.5 min-w-[110px]">IFSC Code</th>
                        <th className="p-2.5 min-w-[120px]">Aadhaar</th>
                        <th className="p-2.5 min-w-[100px]">PAN</th>
                        <th className="p-2.5 w-12 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {spreadsheetRows.map((row, idx) => {
                        const isNameInvalid = !row.name.trim();
                        const isPhoneInvalid = !row.phone.trim();

                        return (
                          <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-2 text-center font-mono text-slate-400 text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Name Input */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.name}
                                placeholder="e.g. Ramesh Kumar"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "name", e.target.value)}
                                className={`w-full px-2.5 py-1.5 rounded border text-xs text-slate-800 ${
                                  isNameInvalid
                                    ? "border-red-400 bg-red-50/30 focus:border-red-500"
                                    : "border-slate-300 focus:border-blue-500"
                                } focus:outline-none`}
                              />
                            </td>

                            {/* Phone Input */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.phone}
                                placeholder="9876543210"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "phone", e.target.value)}
                                className={`w-full px-2.5 py-1.5 rounded border text-xs text-slate-800 ${
                                  isPhoneInvalid
                                    ? "border-red-400 bg-red-50/30 focus:border-red-500"
                                    : "border-slate-300 focus:border-blue-500"
                                } focus:outline-none`}
                              />
                            </td>

                            {/* Email Input */}
                            <td className="p-1.5">
                              <input
                                type="email"
                                value={row.personalEmail}
                                placeholder="email@gmail.com"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "personalEmail", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* Job Title */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.jobTitle}
                                placeholder="Technician"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "jobTitle", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* Employee Type */}
                            <td className="p-1.5">
                              <select
                                value={row.employeeType}
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "employeeType", e.target.value)}
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                              >
                                <option value="Full Time">Full Time</option>
                                <option value="Permanent">Permanent</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Consultant">Consultant</option>
                                <option value="Intern">Intern</option>
                              </select>
                            </td>

                            {/* Branch */}
                            <td className="p-1.5">
                              <select
                                value={row.branch}
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "branch", e.target.value)}
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                              >
                                <option value="VIJAYAWADA">VIJAYAWADA</option>
                                <option value="Addanki">Addanki</option>
                                <option value="HQ Bangalore">HQ Bangalore</option>
                                <option value="Guntur">Guntur</option>
                              </select>
                            </td>

                            {/* Department */}
                            <td className="p-1.5">
                              <select
                                value={row.department}
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "department", e.target.value)}
                                className="w-full px-2 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                              >
                                <option value="Technical">Technical</option>
                                <option value="Operations">Operations</option>
                                <option value="Accounts">Accounts</option>
                                <option value="Management">Management</option>
                              </select>
                            </td>

                            {/* Bank Name */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.bankName}
                                placeholder="HDFC Bank"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "bankName", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* Bank Account */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.bankAccountNumber}
                                placeholder="Account No"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "bankAccountNumber", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* IFSC */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.ifscCode}
                                placeholder="HDFC0001234"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "ifscCode", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* Aadhaar */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.aadhaar}
                                placeholder="Aadhaar No"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "aadhaar", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* PAN */}
                            <td className="p-1.5">
                              <input
                                type="text"
                                value={row.pan}
                                placeholder="PAN No"
                                onChange={(e) => handleUpdateSpreadsheetRow(row.id, "pan", e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                              />
                            </td>

                            {/* Delete Action */}
                            <td className="p-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteSpreadsheetRow(row.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsWebSpreadsheetOpen(false)}
                    className="text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                  >
                    ← Back to File Upload
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAddStaffFlow(null)}
                      className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyBulkUpload}
                      className="px-6 py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Sync {spreadsheetRows.length} Staff to Database</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* D. Share Invite Link Modal (1:1 media_1788519569498.png) */}
      {addStaffFlow === "invite" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setAddStaffFlow(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-8 text-center space-y-4">
              {/* Paper Plane Icon */}
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center mx-auto shadow-2xs">
                <Mail className="w-7 h-7 stroke-[1.75]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">Invite Staff to SalaryBox</h3>
                <p className="text-xs text-slate-500 mt-1">Staff can use this link to join your company on SalaryBox.</p>
              </div>

              {/* Link Box */}
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                <span className="truncate mr-2 font-mono text-[11px]">{inviteLink}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    setIsCopiedInvite(true);
                    showToast("Invite link copied to clipboard!");
                    setTimeout(() => setIsCopiedInvite(false), 2000);
                  }}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-all cursor-pointer shrink-0"
                  title="Copy Link"
                >
                  {isCopiedInvite ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Share Channels */}
              <div className="pt-2 flex items-center justify-center gap-8">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join our team on SalaryBox: ${inviteLink}`)}`, "_blank");
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-2xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-emerald-600">WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `mailto:?subject=Join our company on SalaryBox&body=Please join using this link: ${inviteLink}`;
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#007BFF] group-hover:text-white transition-all shadow-2xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-[#007BFF]">Email</span>
                </button>

                {/* Copy Message */}
                <button
                  type="button"
                  onClick={() => {
                    const msg = `Hi! You are invited to join RSS LOGISTICS on SalaryBox app. Please download and register using link: ${inviteLink}`;
                    navigator.clipboard.writeText(msg);
                    showToast("Full invite message copied to clipboard!");
                  }}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-all shadow-2xs">
                    <Copy className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">Copy message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. Batch Update Staff Modal */}
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

      {/* F. Update Work Timings Modal */}
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

      {/* G. Update Attendance Modes Modal */}
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

      {/* H. Update Automation Rules Modal */}
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

      {/* I. Mark Staff Active Modal */}
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