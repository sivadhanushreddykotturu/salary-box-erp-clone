"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  MoreVertical,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  Building2,
  CheckCircle2,
  Calendar,
  X,
  ShieldCheck,
  CreditCard,
  Briefcase,
  FileText,
  User,
  Settings,
  Layers,
  Clock,
  DollarSign,
  CalendarDays,
  Percent,
  GitFork,
  Trash2,
  ChevronDown,
  MapPin,
  Smartphone,
  Laptop,
  Camera,
  Wifi,
  Shield,
  Fingerprint,
  QrCode,
  ScanFace,
  Search,
  Compass,
  Info,
  Folder,
  Upload,
  File
} from "lucide-react";
import { TaxDeclarationsView } from "./TaxDeclarationsView";

export interface EmployeeDetailProps {
  employee: {
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
    bankName?: string;
    bankAccount?: string;
    monthlyCtc?: number;
    leaveBalance?: number;
    needsActivation?: boolean;
  };
  onBack: () => void;
  onUpdate: (updated: any) => void;
}

export function EmployeeDetailView({
  employee,
  onBack,
  onUpdate,
}: EmployeeDetailProps) {
  const [activeTab, setActiveTab] = useState("Personal Details");
  const [formData, setFormData] = useState({
    name: employee.name || "Bobba Prasad",
    mobileNumber: employee.mobileNumber || "9052306037",
    personalEmail: employee.personalEmail || "",
    dateOfBirth: employee.dateOfBirth || "",
    gender: employee.gender || "Male",
    maritalStatus: employee.maritalStatus || "",
    bloodGroup: employee.bloodGroup || "",
    guardianName: employee.guardianName || "",
    emergencyContactName: employee.emergencyContactName || "",
    emergencyContactPhone: employee.emergencyContactPhone || "",
    emergencyContactRelationship: employee.emergencyContactRelationship || "",
    emergencyContactAddress: employee.emergencyContactAddress || "",
    aadhaar: employee.aadhaar || "",
    pan: employee.pan || "",
    drivingLicense: employee.drivingLicense || "",
    voterId: employee.voterId || "",
    uan: employee.uan || "",
    currentAddress: employee.currentAddress || "",
    permanentAddress: employee.permanentAddress || "",
    branch: "Vijayawada",
    department: "Technical",
    employeeType: employee.employeeType || "Full Time",
    dateOfJoining: employee.dateOfJoining || "2026-07-03",
    dateOfLeaving: employee.dateOfLeaving || "",
    employeeId: employee.employeeId || "EMP-002",
    jobTitle: employee.jobTitle || "Technician",
    officialEmail: employee.officialEmail || "bobba.prasad@rsslogistics.in",
    esiNumber: employee.esiAccountNo || "",
    pfNumber: employee.pfAccountNo || "",
    bankName: employee.bankName || "State Bank of India",
    accountNumber: employee.bankAccount || "38291029481",
    accountHolder: employee.name || "Bobba Prasad",
    ifscCode: "SBIN0002148",
    paymentType: "bank",
    upiId: "",
  });

  const [selectedBranches, setSelectedBranches] = useState<string[]>(["VIJAYAWADA"]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const availableBranches = ["Addanki", "Guntur", "VIJAYAWADA", "HQ Bangalore"];

  const toggleBranch = (branch: string) => {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branch));
    } else {
      setSelectedBranches([...selectedBranches, branch]);
    }
  };

  const removeBranch = (branch: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBranches(selectedBranches.filter((b) => b !== branch));
  };

  // Modal states
  const [isPastEmploymentModalOpen, setIsPastEmploymentModalOpen] = useState(false);
  const [pastEmployments, setPastEmployments] = useState<any[]>([]);
  const [newPastEmployment, setNewPastEmployment] = useState({
    companyName: "",
    designation: "",
    joiningDate: "",
    leavingDate: "",
    currency: "INR (₹)",
    salary: "",
    companyGst: "",
  });

  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [newCustomField, setNewCustomField] = useState({
    fieldName: "",
    fieldValue: "",
  });

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankType, setBankType] = useState<"bank" | "upi">("bank");
  const [bankFormData, setBankFormData] = useState({
    accountHolder: formData.accountHolder,
    accountNumber: formData.accountNumber,
    bankName: formData.bankName,
    ifscCode: formData.ifscCode,
    upiId: "",
  });

  // Approval Flows State (Screenshots 1-5)
  const [approvalSubView, setApprovalSubView] = useState<"list" | "leave" | "reimbursement">("list");
  const [isAddApprovalFlowModalOpen, setIsAddApprovalFlowModalOpen] = useState(false);
  const [leaveApprovalFlows, setLeaveApprovalFlows] = useState<any[]>([]);
  const [reimbursementApprovalFlows, setReimbursementApprovalFlows] = useState<any[]>([]);

  const [newFlowName, setNewFlowName] = useState("");
  const [flowLevels, setFlowLevels] = useState<
    Array<{ approver: string; policy: string; isDropdownOpen?: boolean }>
  >([{ approver: "All Admins", policy: "Wait for approval" }]);

  const [useAmountThreshold, setUseAmountThreshold] = useState(false);
  const [thresholdAmount, setThresholdAmount] = useState("");
  const [thresholdLevels, setThresholdLevels] = useState<
    Array<{ approver: string; policy: string; isDropdownOpen?: boolean }>
  >([{ approver: "All Admins", policy: "Wait for approval" }]);

  // User Permission States (Screenshots 1-3)
  const initialRole = "Employee";
  const [selectedUserRole, setSelectedUserRole] = useState("Employee");
  const [customPermissions, setCustomPermissions] = useState<Record<string, { view?: boolean; edit?: boolean; approve?: boolean }>>({
    "Staff Attendance Records": { view: false, edit: false },
    "Attendance Reports": { view: false, edit: false },
    "Work Timings & Roster": { view: false, edit: false },
    "Attendance Modes": { view: false, edit: false },
    "Automation Rules": { view: false, edit: false },
    "Leave Requests": { approve: false },
    "Balances & Policies": { view: false, edit: false },
    "Reimbursement Requests": { view: false, edit: false, approve: false },
  });

  const isUserPermissionDirty =
    selectedUserRole !== initialRole ||
    Object.values(customPermissions).some(
      (p) => p.view || p.edit || p.approve
    );

  // Timezone options exactly matching SalaryBox (with Calcutta, Asia default)
  const TIMEZONE_OPTIONS = [
    { city: "Calcutta", region: "Asia", code: "IST", offset: "GMT +05:30" },
    { city: "Asmara", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Asmera", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Bamako", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Bangui", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Banjul", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Bissau", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Blantyre", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Brazzaville", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Bujumbura", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Cairo", region: "Africa", code: "EEST", offset: "GMT +03:00" },
    { city: "Casablanca", region: "Africa", code: "+01", offset: "GMT +01:00" },
    { city: "Ceuta", region: "Africa", code: "CEST", offset: "GMT +02:00" },
    { city: "Conakry", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Dakar", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Dar es Salaam", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Djibouti", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Douala", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "El Aaiun", region: "Africa", code: "+01", offset: "GMT +01:00" },
    { city: "Freetown", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Gaborone", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Harare", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Johannesburg", region: "Africa", code: "SAST", offset: "GMT +02:00" },
    { city: "Juba", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Kampala", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Khartoum", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Kigali", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Kinshasa", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Lagos", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Libreville", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Lome", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Luanda", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Lubumbashi", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Lusaka", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Malabo", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Maputo", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Maseru", region: "Africa", code: "SAST", offset: "GMT +02:00" },
    { city: "Mbabane", region: "Africa", code: "SAST", offset: "GMT +02:00" },
    { city: "Mogadishu", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Monrovia", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Nairobi", region: "Africa", code: "EAT", offset: "GMT +03:00" },
    { city: "Ndjamena", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Niamey", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Nouakchott", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Ouagadougou", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Porto-Novo", region: "Africa", code: "WAT", offset: "GMT +01:00" },
    { city: "Sao Tome", region: "Africa", code: "GMT", offset: "GMT +00:00" },
    { city: "Tripoli", region: "Africa", code: "EEST", offset: "GMT +02:00" },
    { city: "Tunis", region: "Africa", code: "CET", offset: "GMT +01:00" },
    { city: "Windhoek", region: "Africa", code: "CAT", offset: "GMT +02:00" },
    { city: "Dubai", region: "Asia", code: "GST", offset: "GMT +04:00" },
    { city: "Singapore", region: "Asia", code: "SGT", offset: "GMT +08:00" },
    { city: "Tokyo", region: "Asia", code: "JST", offset: "GMT +09:00" },
    { city: "Hong Kong", region: "Asia", code: "HKT", offset: "GMT +08:00" },
    { city: "Bangkok", region: "Asia", code: "ICT", offset: "GMT +07:00" },
    { city: "London", region: "Europe", code: "BST", offset: "GMT +01:00" },
    { city: "New York", region: "America", code: "EDT", offset: "GMT -04:00" },
    { city: "Sydney", region: "Australia", code: "AEST", offset: "GMT +10:00" },
  ];

  // Attendance Details State (Screenshot Match)
  const [attendanceDetailsSubView, setAttendanceDetailsSubView] = useState<
    "landing" | "work_timings" | "attendance_modes" | "automation_rules"
  >("landing");
  const [attendanceTimezone, setAttendanceTimezone] = useState("Calcutta, Asia");
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const [timezoneSearchQuery, setTimezoneSearchQuery] = useState("");
  const [canStaffViewOwnAttendance, setCanStaffViewOwnAttendance] = useState(true);

  // Work Timings Schedule State (Screenshot Match)
  const [timingType, setTimingType] = useState<"Fixed" | "Flexible">("Fixed");
  const [dailySchedules, setDailySchedules] = useState<
    Record<
      string,
      {
        isWeekoff: boolean;
        weekoffType?: string;
        shifts: Array<{ name: string; timing: string }>;
      }
    >
  >({
    Mon: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Tue: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Wed: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Thu: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Fri: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Sat: { isWeekoff: false, shifts: [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }] },
    Sun: { isWeekoff: true, weekoffType: "All sundays week off", shifts: [] },
  });

  const [flexibleHours, setFlexibleHours] = useState("9");
  const [flexibleMins, setFlexibleMins] = useState("00");
  const [coreHoursStart, setCoreHoursStart] = useState("10:00 AM");
  const [coreHoursEnd, setCoreHoursEnd] = useState("04:00 PM");
  const [flexibleWeekoffDays, setFlexibleWeekoffDays] = useState<string[]>(["Sun"]);

  // Attendance Modes State (1:1 Screenshot Match)
  const [allowPunchFromStaffApp, setAllowPunchFromStaffApp] = useState(true);
  const [isSelfieAttendance, setIsSelfieAttendance] = useState(true);
  const [isQrAttendance, setIsQrAttendance] = useState(false);
  const [isGpsAttendance, setIsGpsAttendance] = useState(true);
  const [markAttendanceFrom, setMarkAttendanceFrom] = useState<"From Office" | "From Anywhere">("From Office");

  // Automation Rules State (1:1 Screenshot Match)
  const [autoPresentAtDayStart, setAutoPresentAtDayStart] = useState(false);
  const [presentOnPunchIn, setPresentOnPunchIn] = useState(false);
  const [autoHalfDayIfLateBy, setAutoHalfDayIfLateBy] = useState<{ hours: string; minutes: string } | null>(null);
  const [mandatoryHalfDayHours, setMandatoryHalfDayHours] = useState<{ hours: string; minutes: string } | null>(null);
  const [mandatoryFullDayHours, setMandatoryFullDayHours] = useState<{ hours: string; minutes: string } | null>(null);

  // Automation Rule Duration Modal State
  const [isAutomationRuleModalOpen, setIsAutomationRuleModalOpen] = useState(false);
  const [activeAutomationRuleKey, setActiveAutomationRuleKey] = useState<
    "autoHalfDayIfLateBy" | "mandatoryHalfDayHours" | "mandatoryFullDayHours" | null
  >(null);
  const [activeAutomationRuleTitle, setActiveAutomationRuleTitle] = useState("");
  const [automationModalHours, setAutomationModalHours] = useState("");
  const [automationModalMinutes, setAutomationModalMinutes] = useState("");

  const handleOpenAutomationRuleModal = (
    key: "autoHalfDayIfLateBy" | "mandatoryHalfDayHours" | "mandatoryFullDayHours",
    title: string
  ) => {
    setActiveAutomationRuleKey(key);
    setActiveAutomationRuleTitle(title);
    let currentVal: { hours: string; minutes: string } | null = null;
    if (key === "autoHalfDayIfLateBy") currentVal = autoHalfDayIfLateBy;
    if (key === "mandatoryHalfDayHours") currentVal = mandatoryHalfDayHours;
    if (key === "mandatoryFullDayHours") currentVal = mandatoryFullDayHours;

    setAutomationModalHours(currentVal?.hours || "");
    setAutomationModalMinutes(currentVal?.minutes || "");
    setIsAutomationRuleModalOpen(true);
  };

  const handleConfirmAutomationRule = () => {
    const val =
      automationModalHours.trim() || automationModalMinutes.trim()
        ? {
            hours: automationModalHours.trim() || "0",
            minutes: automationModalMinutes.trim() || "0",
          }
        : null;

    if (activeAutomationRuleKey === "autoHalfDayIfLateBy") setAutoHalfDayIfLateBy(val);
    if (activeAutomationRuleKey === "mandatoryHalfDayHours") setMandatoryHalfDayHours(val);
    if (activeAutomationRuleKey === "mandatoryFullDayHours") setMandatoryFullDayHours(val);

    setIsAutomationRuleModalOpen(false);
  };

  const handleTurnOffAutomationRule = () => {
    if (activeAutomationRuleKey === "autoHalfDayIfLateBy") setAutoHalfDayIfLateBy(null);
    if (activeAutomationRuleKey === "mandatoryHalfDayHours") setMandatoryHalfDayHours(null);
    if (activeAutomationRuleKey === "mandatoryFullDayHours") setMandatoryFullDayHours(null);

    setIsAutomationRuleModalOpen(false);
  };

  // Day Name Mapping for Shifts Modal
  const dayNameMap: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const [availableShifts, setAvailableShifts] = useState<
    Array<{ id: string; name: string; timing: string }>
  >([
    { id: "1", name: "REGULAR", timing: "09:00 AM - 06:30 PM" },
    { id: "2", name: "Women Shift", timing: "10:00 AM - 06:30 PM" },
    { id: "3", name: "Trainee", timing: "03:00 PM - 06:30 PM" },
  ]);

  // Shift Editing State (1:1 Screenshot Match)
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [editingShiftDay, setEditingShiftDay] = useState<string>("Mon");
  const [selectedShiftIdsInModal, setSelectedShiftIdsInModal] = useState<string[]>(["1"]);
  const [isAddCustomShiftInline, setIsAddCustomShiftInline] = useState(false);
  const [newCustomShiftName, setNewCustomShiftName] = useState("");
  const [newCustomShiftStart, setNewCustomShiftStart] = useState("09:00 AM");
  const [newCustomShiftEnd, setNewCustomShiftEnd] = useState("06:30 PM");

  const handleToggleWeekoff = (day: string) => {
    setDailySchedules((prev) => {
      const current = prev[day] || { isWeekoff: false, shifts: [] };
      const nextIsWeekoff = !current.isWeekoff;
      return {
        ...prev,
        [day]: {
          ...current,
          isWeekoff: nextIsWeekoff,
          shifts: nextIsWeekoff
            ? []
            : current.shifts && current.shifts.length > 0
            ? current.shifts
            : [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }],
          weekoffType: day === "Sun" ? current.weekoffType || "All sundays week off" : undefined,
        },
      };
    });
  };

  const handleSundayWeekoffTypeChange = (type: string) => {
    setDailySchedules((prev) => ({
      ...prev,
      Sun: {
        ...prev.Sun,
        weekoffType: type,
      },
    }));
  };

  const handleRemoveShift = (day: string, idx: number) => {
    setDailySchedules((prev) => {
      const currentShifts = [...(prev[day]?.shifts || [])];
      currentShifts.splice(idx, 1);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          shifts: currentShifts,
        },
      };
    });
  };

  const handleAddShift = (day: string) => {
    handleOpenDayShiftsModal(day);
  };

  const handleOpenDayShiftsModal = (day: string) => {
    setEditingShiftDay(day);
    const currentDayShifts = dailySchedules[day]?.shifts || [];
    // Match existing shifts in availableShifts list
    const matchedIds = availableShifts
      .filter((s) => currentDayShifts.some((ds) => ds.name === s.name || ds.timing === s.timing))
      .map((s) => s.id);

    setSelectedShiftIdsInModal(matchedIds.length > 0 ? matchedIds : ["1"]);
    setIsAddCustomShiftInline(false);
    setIsShiftModalOpen(true);
  };

  const handleToggleModalShift = (shiftId: string) => {
    if (selectedShiftIdsInModal.includes(shiftId)) {
      if (selectedShiftIdsInModal.length > 1) {
        setSelectedShiftIdsInModal(selectedShiftIdsInModal.filter((id) => id !== shiftId));
      }
    } else {
      setSelectedShiftIdsInModal([...selectedShiftIdsInModal, shiftId]);
    }
  };

  const handleSaveModalShifts = () => {
    const chosenShifts = availableShifts
      .filter((s) => selectedShiftIdsInModal.includes(s.id))
      .map((s) => ({ name: s.name, timing: s.timing }));

    setDailySchedules((prev) => ({
      ...prev,
      [editingShiftDay]: {
        ...prev[editingShiftDay],
        shifts:
          chosenShifts.length > 0
            ? chosenShifts
            : [{ name: "REGULAR", timing: "09:00 AM - 06:30 PM" }],
      },
    }));
    setIsShiftModalOpen(false);
  };

  const handleCreateNewShift = () => {
    if (!newCustomShiftName.trim()) return;
    const newShift = {
      id: String(Date.now()),
      name: newCustomShiftName.trim(),
      timing: `${newCustomShiftStart} - ${newCustomShiftEnd}`,
    };
    setAvailableShifts([...availableShifts, newShift]);
    setSelectedShiftIdsInModal([...selectedShiftIdsInModal, newShift.id]);
    setIsAddCustomShiftInline(false);
    setNewCustomShiftName("");
  };

  // Salary Details State (1:1 Match with Screenshots)
  const [salaryEffectiveDate, setSalaryEffectiveDate] = useState("Sep 2026");
  const [salaryType, setSalaryType] = useState("Per Month");
  const [salaryStructure, setSalaryStructure] = useState("SalaryBox provided...");
  const [isSalaryStructureDropdownOpen, setIsSalaryStructureDropdownOpen] = useState(false);
  const [ctcAmount, setCtcAmount] = useState("25000");

  // Earnings Breakdown
  const [salaryEarnings, setSalaryEarnings] = useState({
    basic: "12500",
    hra: "6250",
    travelAllowance: "2500",
    specialAllowance: "3750",
  });

  // Compliances: Employer Contributions
  const [employerPfCalc, setEmployerPfCalc] = useState("None");
  const [isEmployerPfIncludedInCtc, setIsEmployerPfIncludedInCtc] = useState(false);
  const [employerPfAmount, setEmployerPfAmount] = useState("0");

  const [employerPfEdliCalc, setEmployerPfEdliCalc] = useState("None");
  const [employerPfEdliAmount, setEmployerPfEdliAmount] = useState("0");

  const [employerEsiCalc, setEmployerEsiCalc] = useState("None");
  const [isEmployerEsiIncludedInCtc, setIsEmployerEsiIncludedInCtc] = useState(false);
  const [employerEsiAmount, setEmployerEsiAmount] = useState("0");

  const [employerLwfCalc, setEmployerLwfCalc] = useState("None");
  const [isEmployerLwfIncludedInCtc, setIsEmployerLwfIncludedInCtc] = useState(false);
  const [employerLwfAmount, setEmployerLwfAmount] = useState("0");

  // Compliances: Employee Contributions
  const [employeePfCalc, setEmployeePfCalc] = useState("None");
  const [employeePfAmount, setEmployeePfAmount] = useState("0");

  const [employeeEsiCalc, setEmployeeEsiCalc] = useState("None");
  const [employeeEsiAmount, setEmployeeEsiAmount] = useState("0");

  const [professionalTaxCalc, setProfessionalTaxCalc] = useState("None");
  const [employeeLwfCalc, setEmployeeLwfCalc] = useState("None");
  const [employeeLwfAmount, setEmployeeLwfAmount] = useState("0");

  // Deductions list
  const [salaryDeductions, setSalaryDeductions] = useState<
    Array<{ id: string; name: string; calculation: string; amount: string }>
  >([]);
  const [isAddDeductionModalOpen, setIsAddDeductionModalOpen] = useState(false);
  const [newDeductionName, setNewDeductionName] = useState("");
  const [newDeductionCalc, setNewDeductionCalc] = useState("Fixed Amount");
  const [newDeductionAmount, setNewDeductionAmount] = useState("");

  // Additional Settings State (1:1 Screenshot Match)
  const [canUseLocationTracking, setCanUseLocationTracking] = useState(false);
  const [canUseCrmLite, setCanUseCrmLite] = useState(false);

  // Documents State (1:1 Match with Screenshots)
  const [documentsSubView, setDocumentsSubView] = useState<"root" | "salary_slips">("root");
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [selectedUploadDocType, setSelectedUploadDocType] = useState("");
  const [isDocTypeDropdownOpen, setIsDocTypeDropdownOpen] = useState(false);
  const [isAddSalarySlipModalOpen, setIsAddSalarySlipModalOpen] = useState(false);
  const [newSlipMonth, setNewSlipMonth] = useState("Aug 2026");
  const [salarySlipsList, setSalarySlipsList] = useState<
    Array<{ id: string; docType: string; fileName: string; addedOn: string }>
  >([]);

  // Penalty & Overtime Details State (1:1 Match with Screenshots)
  const [penaltySubView, setPenaltySubView] = useState<
    "root" | "early_leaving" | "late_coming" | "overtime"
  >("root");

  // Early Leaving Policy State
  const [earlyLeavingAllowedDays, setEarlyLeavingAllowedDays] = useState("0");
  const [earlyLeavingOnlyDeductIfEarlierThan, setEarlyLeavingOnlyDeductIfEarlierThan] = useState("0");
  const [earlyLeavingDeductionMode, setEarlyLeavingDeductionMode] = useState<"fixed" | "dynamic">("fixed");
  const [earlyLeavingDeductionType, setEarlyLeavingDeductionType] = useState("Fixed Daily Rate");
  const [earlyLeavingDeductionAmount, setEarlyLeavingDeductionAmount] = useState("0");

  // Late Coming Policy State
  const [lateComingAllowedDays, setLateComingAllowedDays] = useState("0");
  const [lateComingOnlyDeductIfLateBy, setLateComingOnlyDeductIfLateBy] = useState("0");
  const [lateComingDeductionMode, setLateComingDeductionMode] = useState<"fixed" | "dynamic">("fixed");
  const [lateComingDeductionType, setLateComingDeductionType] = useState("Fixed Daily Rate");
  const [lateComingDeductionAmount, setLateComingDeductionAmount] = useState("0");

  // Overtime Policy State
  const [overtimeConsideredAfterMins, setOvertimeConsideredAfterMins] = useState("0");
  const [extraHoursPayType, setExtraHoursPayType] = useState("Fixed Hourly Rate");
  const [extraHoursPayAmount, setExtraHoursPayAmount] = useState("0");
  const [publicHolidayPayType, setPublicHolidayPayType] = useState("Fixed Daily Rate");
  const [publicHolidayPayAmount, setPublicHolidayPayAmount] = useState("0");
  const [weekOffPayType, setWeekOffPayType] = useState("Fixed Daily Rate");
  const [weekOffPayAmount, setWeekOffPayAmount] = useState("0");

  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [pendingNavTab, setPendingNavTab] = useState<string | null>(null);

  const attemptNavigate = (target: string) => {
    if (isUserPermissionDirty) {
      setPendingNavTab(target);
      setIsUnsavedModalOpen(true);
      return;
    }
    if (target === "BACK") {
      onBack();
    } else {
      setActiveTab(target);
      if (target === "Approval Flows") {
        setApprovalSubView("list");
      }
    }
  };

  const handleConfirmLeavePage = () => {
    setIsUnsavedModalOpen(false);
    // Reset dirty state
    setSelectedUserRole(initialRole);
    setCustomPermissions({
      "Staff Attendance Records": { view: false, edit: false },
      "Attendance Reports": { view: false, edit: false },
      "Work Timings & Roster": { view: false, edit: false },
      "Attendance Modes": { view: false, edit: false },
      "Automation Rules": { view: false, edit: false },
      "Leave Requests": { approve: false },
      "Balances & Policies": { view: false, edit: false },
      "Reimbursement Requests": { view: false, edit: false, approve: false },
    });

    if (pendingNavTab === "BACK") {
      onBack();
    } else if (pendingNavTab) {
      setActiveTab(pendingNavTab);
      if (pendingNavTab === "Approval Flows") {
        setApprovalSubView("list");
      }
    }
    setPendingNavTab(null);
  };

  const navTabs = [
    { id: "Personal Details", label: "Personal Details", icon: User },
    { id: "Employment Details", label: "Employment Details", icon: Briefcase },
    { id: "Custom Details", label: "Custom Details", icon: Layers },
    {
      id: "Background Verification",
      label: "Background Verification",
      icon: ShieldCheck,
      badge: "Not Started",
      badgeType: "red",
    },
    {
      id: "Bank Account",
      label: "Bank Account",
      icon: CreditCard,
      badge: "Not Verified",
      badgeType: "red",
    },
    { id: "Approval Flows", label: "Approval Flows", icon: FileText },
    { id: "User Permission", label: "User Permission", icon: User },
    { id: "Attendance Details", label: "Attendance Details", icon: Clock },
    { id: "Salary Details", label: "Salary Details", icon: DollarSign },
    { id: "Leave Details", label: "Leave Details", icon: CalendarDays },
    { id: "Penalty & Overtime Details", label: "Penalty & Overtime Details", icon: Percent },
    { id: "Tax Declarations", label: "Tax Declarations", icon: FileText },
    { id: "Documents", label: "Documents", icon: FileText },
    { id: "Additional Settings", label: "Additional Settings", icon: Settings },
  ];

  const handleSaveDetails = () => {
    onUpdate({
      ...employee,
      name: formData.name,
      jobTitle: formData.jobTitle,
      mobileNumber: formData.mobileNumber,
      personalEmail: formData.personalEmail,
      dateOfJoining: formData.dateOfJoining,
      dateOfLeaving: formData.dateOfLeaving,
      employeeId: formData.employeeId,
      employeeType: formData.employeeType,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      aadhaar: formData.aadhaar,
      pan: formData.pan,
      uan: formData.uan,
      pfAccountNo: formData.pfNumber,
      esiAccountNo: formData.esiNumber,
      bankName: formData.bankName,
      bankAccount: formData.accountNumber,
    });
    alert("Employee details updated successfully!");
  };

  const handleAddPastEmployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPastEmployment.companyName || !newPastEmployment.joiningDate) {
      alert("Please provide Company Name and Joining Date.");
      return;
    }
    setPastEmployments([...pastEmployments, newPastEmployment]);
    setIsPastEmploymentModalOpen(false);
    setNewPastEmployment({
      companyName: "",
      designation: "",
      joiningDate: "",
      leavingDate: "",
      currency: "INR (₹)",
      salary: "",
      companyGst: "",
    });
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomField.fieldName) return;
    setCustomFields([...customFields, newCustomField]);
    setIsCustomFieldModalOpen(false);
    setNewCustomField({ fieldName: "", fieldValue: "" });
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({
      ...formData,
      accountHolder: bankFormData.accountHolder,
      accountNumber: bankFormData.accountNumber,
      bankName: bankFormData.bankName,
      ifscCode: bankFormData.ifscCode,
      upiId: bankFormData.upiId,
      paymentType: bankType,
    });
    setIsBankModalOpen(false);
    alert("Bank details saved successfully!");
  };

  const handleAddApprovalLevel = () => {
    setFlowLevels([
      ...flowLevels,
      { approver: "PAPPU SRINIVASA PRABHAKAR RAO", policy: "Wait for approval" },
    ]);
  };

  const handleSaveApprovalFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowName.trim()) {
      alert("Please enter a Flow Name.");
      return;
    }

    const createdFlow = {
      id: String(Date.now()),
      name: newFlowName,
      levels: [...flowLevels],
    };

    if (approvalSubView === "leave") {
      setLeaveApprovalFlows([...leaveApprovalFlows, createdFlow]);
    } else {
      setReimbursementApprovalFlows([...reimbursementApprovalFlows, createdFlow]);
    }

    setIsAddApprovalFlowModalOpen(false);
    setNewFlowName("");
    setFlowLevels([{ approver: "All Admins", policy: "Wait for approval" }]);
    alert("Approval flow configured successfully!");
  };

  if (activeTab === "Tax Declarations") {
    return (
      <TaxDeclarationsView
        employee={{
          id: employee.id,
          name: formData.name,
          initials: employee.initials,
          avatarColor: employee.avatarColor,
          jobTitle: formData.jobTitle,
          monthlyCtc: employee.monthlyCtc || 28000,
        }}
        onBack={() => setActiveTab("Personal Details")}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs min-h-[750px]">
      {/* Top Breadcrumb Bar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => attemptNavigate("BACK")}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </button>

          <div
            className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${employee.avatarColor}`}
          >
            {employee.initials}
          </div>

          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {formData.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Staff Status</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              Active
            </span>
          </div>

          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Left Nav Tabs + Right Details Area */}
      <div className="grid grid-cols-12 min-h-[680px]">
        {/* Left Nav Tabs (3 Columns) */}
        <div className="col-span-3 border-r border-slate-200 bg-[#FAFBFD] p-2 space-y-0.5">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => attemptNavigate(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                    : "text-slate-700 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className={isActive ? "text-[#007BFF]" : "text-slate-700"}>
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-600 font-normal">
                      <span className="w-3 h-3 rounded-full bg-red-500 text-white flex items-center justify-center text-[8px] font-bold">
                        !
                      </span>
                      <span>{tab.badge}</span>
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#007BFF]" : "text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Details Panel (9 Columns) */}
        <div className="col-span-9 p-6 overflow-y-auto">
          {/* TAB 1: Personal Details */}
          {activeTab === "Personal Details" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Personal Details</h3>
                <button
                  onClick={handleSaveDetails}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Update Details
                </button>
              </div>

              {/* 1. Basic Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Basic Details
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Name:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Mobile Number:
                    </label>
                    <div className="col-span-2 flex gap-2">
                      <select className="px-2 py-1.5 text-xs rounded border border-slate-300 bg-white">
                        <option>+91</option>
                      </select>
                      <input
                        type="text"
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mobileNumber: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Personal Email ID:</label>
                    <div className="col-span-2">
                      <input
                        type="email"
                        value={formData.personalEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, personalEmail: e.target.value })
                        }
                        placeholder="e.g. prasad@gmail.com"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Date of Birth:</label>
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Gender:</label>
                    <div className="col-span-2">
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Marital Status:</label>
                    <div className="col-span-2">
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) =>
                          setFormData({ ...formData, maritalStatus: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option value="">Select Marital Status</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Blood Group:</label>
                    <div className="col-span-2">
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          setFormData({ ...formData, bloodGroup: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option value="">Select Blood Group</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Guardian's Name:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.guardianName}
                        onChange={(e) =>
                          setFormData({ ...formData, guardianName: e.target.value })
                        }
                        placeholder="Father / Guardian Name"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      Emergency Contact Name:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactName: e.target.value,
                          })
                        }
                        placeholder="Contact Person Name"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      Emergency Contact Mobile:
                    </label>
                    <div className="col-span-2 flex gap-2">
                      <select className="px-2 py-1.5 text-xs rounded border border-slate-300 bg-white">
                        <option>+91</option>
                      </select>
                      <input
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactPhone: e.target.value,
                          })
                        }
                        placeholder="10-digit number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      Emergency Contact Relationship:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactRelationship: e.target.value,
                          })
                        }
                        placeholder="e.g. Spouse, Father, Brother"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-start gap-4">
                    <label className="text-slate-600 font-medium pt-1">
                      Emergency Contact Address:
                    </label>
                    <div className="col-span-2">
                      <textarea
                        rows={2}
                        value={formData.emergencyContactAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContactAddress: e.target.value,
                          })
                        }
                        placeholder="Full residential address"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Government IDs */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Government IDs
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Aadhaar:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.aadhaar}
                        onChange={(e) =>
                          setFormData({ ...formData, aadhaar: e.target.value })
                        }
                        placeholder="12-digit Aadhaar number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">PAN:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.pan}
                        onChange={(e) =>
                          setFormData({ ...formData, pan: e.target.value.toUpperCase() })
                        }
                        placeholder="e.g. ABCDE1234F"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Driving License:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.drivingLicense}
                        onChange={(e) =>
                          setFormData({ ...formData, drivingLicense: e.target.value })
                        }
                        placeholder="DL number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Voter ID:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.voterId}
                        onChange={(e) =>
                          setFormData({ ...formData, voterId: e.target.value })
                        }
                        placeholder="EPIC number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">UAN:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.uan}
                        onChange={(e) =>
                          setFormData({ ...formData, uan: e.target.value })
                        }
                        placeholder="12-digit UAN"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Address Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Address Details
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 items-start gap-4">
                    <label className="text-slate-600 font-medium pt-1">
                      Current Address:
                    </label>
                    <div className="col-span-2">
                      <textarea
                        rows={2}
                        value={formData.currentAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, currentAddress: e.target.value })
                        }
                        placeholder="Door no, Street, Landmark, City, Pincode"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-start gap-4">
                    <label className="text-slate-600 font-medium pt-1">
                      Permanent Address:
                    </label>
                    <div className="col-span-2">
                      <textarea
                        rows={2}
                        value={formData.permanentAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permanentAddress: e.target.value,
                          })
                        }
                        placeholder="Permanent native address"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Employment Details */}
          {activeTab === "Employment Details" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Employment Details
                </h3>
                <button
                  onClick={handleSaveDetails}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Update Details
                </button>
              </div>

              {/* Current Employment */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Current Employment
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 items-start gap-4">
                    <label className="text-slate-600 font-medium pt-2">
                      <span className="text-red-500">*</span> Branches:
                    </label>
                    <div className="col-span-2 relative">
                      <div
                        onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                        className="min-h-[34px] w-full px-2 py-1 text-xs rounded border border-slate-300 bg-white flex flex-wrap items-center gap-1.5 cursor-pointer focus-within:ring-1 focus-within:ring-blue-500"
                      >
                        {selectedBranches.map((branch) => (
                          <span
                            key={branch}
                            className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs inline-flex items-center gap-1.5 font-medium"
                          >
                            <span>{branch}</span>
                            <span
                              onClick={(e) => removeBranch(branch, e)}
                              className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer text-xs leading-none"
                            >
                              ×
                            </span>
                          </span>
                        ))}
                        <span className="w-0.5 h-3.5 bg-slate-400 animate-pulse ml-0.5" />
                      </div>

                      {isBranchDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsBranchDropdownOpen(false)}
                          />
                          <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-lg border border-slate-200 z-40 py-1 text-xs max-h-48 overflow-y-auto">
                            {availableBranches.map((branch) => {
                              const isSelected = selectedBranches.includes(branch);
                              return (
                                <div
                                  key={branch}
                                  onClick={() => toggleBranch(branch)}
                                  className={`px-3 py-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                                    isSelected
                                      ? "bg-[#EBF5FF] text-[#007BFF] font-medium"
                                      : "text-slate-700"
                                  }`}
                                >
                                  <span>{branch}</span>
                                  {isSelected && (
                                    <span className="text-[#007BFF] font-bold text-xs">✓</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Departments:</label>
                    <div className="col-span-2">
                      <select
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option>Technical</option>
                        <option>Operations</option>
                        <option>Logistics</option>
                        <option>HR & Management</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Employee Type:</label>
                    <div className="col-span-2">
                      <select
                        value={formData.employeeType}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeType: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      >
                        <option>Full Time</option>
                        <option>Permanent</option>
                        <option>Contract</option>
                        <option>Intern</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Date of Joining:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfJoining: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Date of Leaving:</label>
                    <div className="col-span-2">
                      <input
                        type="date"
                        value={formData.dateOfLeaving}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfLeaving: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Employee ID:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.employeeId}
                        onChange={(e) =>
                          setFormData({ ...formData, employeeId: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Job Title:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">Official Email ID:</label>
                    <div className="col-span-2">
                      <input
                        type="email"
                        value={formData.officialEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, officialEmail: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">ESI Number:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.esiNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, esiNumber: e.target.value })
                        }
                        placeholder="17-digit ESI Number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="text-slate-600 font-medium">PF Number:</label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={formData.pfNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, pfNumber: e.target.value })
                        }
                        placeholder="22-digit PF Number"
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Employment */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Past Employment
                  </h4>
                  <button
                    onClick={() => setIsPastEmploymentModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {pastEmployments.length === 0 ? (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No Past Employment Details
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pastEmployments.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-800">
                            {item.companyName}
                          </div>
                          <div className="text-slate-500">
                            {item.designation} • {item.joiningDate} to{" "}
                            {item.leavingDate}
                          </div>
                        </div>
                        <div className="font-semibold text-slate-700">
                          ₹{item.salary}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Custom Details */}
          {activeTab === "Custom Details" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Custom Details</h3>
                <button
                  onClick={() => setIsCustomFieldModalOpen(true)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Field</span>
                </button>
              </div>

              {customFields.length === 0 ? (
                <div className="py-12 px-6 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <div className="font-bold text-slate-700 text-sm">
                    No Custom Fields Added
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Add Custom Fields to store employee data like laptop number, badge
                    number, emergency group, asset tag etc.
                  </p>
                  <button
                    onClick={() => setIsCustomFieldModalOpen(true)}
                    className="mt-3 px-4 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Field</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {customFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1"
                    >
                      <div className="font-semibold text-slate-500">
                        {field.fieldName}
                      </div>
                      <div className="font-bold text-slate-800 font-mono">
                        {field.fieldValue}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Background Verification */}
          {activeTab === "Background Verification" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Background Verification
                </h3>
              </div>

              {/* Offer Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#007BFF]" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Verify staff to prevent fraud for{" "}
                      <span className="line-through text-slate-400 font-normal">
                        ₹ 500
                      </span>{" "}
                      <span className="text-[#007BFF] font-black text-sm">
                        ₹ 100
                      </span>{" "}
                      only !
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Instant government-verified checks via Decentro API
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Initiating Decentro Verification Suite...")}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Verify Now
                </button>
              </div>

              {/* ID Proofs Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ID Proofs
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: "PAN", status: "Not Added" },
                    { label: "Driving License", status: "Not Added" },
                    { label: "Voter ID", status: "Not Added" },
                    { label: "UAN", status: "Not Added" },
                    { label: "Face", status: "Not Verified" },
                    { label: "Address", status: "Not Added" },
                    { label: "Past Employment", status: "Not Added" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="text-slate-400 font-medium text-[11px]">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-center text-xs text-slate-500">
                All Verification Reports will be available under <strong>Documents</strong>
              </div>
            </div>
          )}

          {/* TAB 5: Bank Account */}
          {activeTab === "Bank Account" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Bank Account</h3>
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add Details
                </button>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#007BFF] flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {formData.bankName}
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        A/C: {formData.accountNumber} • IFSC: {formData.ifscCode}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Penny Drop Pending</span>
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Account Holder:</span>
                    <div className="font-semibold text-slate-800">
                      {formData.accountHolder}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Payout Mode:</span>
                    <div className="font-semibold text-slate-800 uppercase">
                      {formData.paymentType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Approval Flows (Screenshots 1-5 Match 1:1) */}
          {activeTab === "Approval Flows" && (
            <div className="space-y-6 max-w-3xl">
              {/* Approval Flows Landing View (Screenshot 1) */}
              {approvalSubView === "list" && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
                    Approval Flows
                  </h3>

                  <div className="space-y-3">
                    {/* Card 1: Leave Approval Flow */}
                    <div
                      onClick={() => setApprovalSubView("leave")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 text-sm group-hover:text-[#007BFF] transition-colors">
                          Leave Approval Flow
                        </div>
                        <div className="text-xs text-slate-500">
                          {leaveApprovalFlows.length > 0
                            ? `${leaveApprovalFlows.length} active flow configured`
                            : "No approval flows configured"}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* Card 2: Reimbursement Approval Flow */}
                    <div
                      onClick={() => setApprovalSubView("reimbursement")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 text-sm group-hover:text-[#007BFF] transition-colors">
                          Reimbursement Approval Flow
                        </div>
                        <div className="text-xs text-slate-500">
                          {reimbursementApprovalFlows.length > 0
                            ? `${reimbursementApprovalFlows.length} active flow configured`
                            : "No approval flows configured"}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-view: Leave / Reimbursement Approval Flow (Screenshot 2) */}
              {(approvalSubView === "leave" || approvalSubView === "reimbursement") && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <button
                        onClick={() => setApprovalSubView("list")}
                        className="text-[#007BFF] hover:underline cursor-pointer"
                      >
                        Approval Flows
                      </button>
                      <span className="text-slate-400">&gt;&gt;</span>
                      <span className="text-slate-800">
                        {approvalSubView === "leave"
                          ? "Leave Approval Flow"
                          : "Reimbursement Approval Flow"}
                      </span>
                    </div>

                    <button
                      disabled={
                        (approvalSubView === "leave" && leaveApprovalFlows.length === 0) ||
                        (approvalSubView === "reimbursement" && reimbursementApprovalFlows.length === 0)
                      }
                      onClick={() => alert("Approval flow updated successfully!")}
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                        (approvalSubView === "leave" && leaveApprovalFlows.length > 0) ||
                        (approvalSubView === "reimbursement" && reimbursementApprovalFlows.length > 0)
                          ? "text-white bg-[#007BFF] hover:bg-blue-600 shadow-xs cursor-pointer"
                          : "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                      }`}
                    >
                      Update Details
                    </button>
                  </div>

                  {/* Empty State vs Flow List */}
                  {(approvalSubView === "leave" && leaveApprovalFlows.length === 0) ||
                  (approvalSubView === "reimbursement" && reimbursementApprovalFlows.length === 0) ? (
                    <div className="py-16 text-center space-y-4">
                      {/* Flow Hierarchy Blueprint Icon */}
                      <div className="w-14 h-14 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                        <GitFork className="w-6 h-6 stroke-[2.2]" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">
                          No approval flows yet
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Create a flow to route this staff member's{" "}
                          {approvalSubView === "leave" ? "leave" : "reimbursement"}{" "}
                          requests through more than one approver.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddApprovalFlowModalOpen(true)}
                        className="px-6 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Flow</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Configured Approval Steps
                        </h4>
                        <button
                          onClick={() => setIsAddApprovalFlowModalOpen(true)}
                          className="px-3 py-1 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Another Flow</span>
                        </button>
                      </div>

                      {(approvalSubView === "leave"
                        ? leaveApprovalFlows
                        : reimbursementApprovalFlows
                      ).map((flow, fIdx) => (
                        <div
                          key={flow.id}
                          className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {flow.name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Sequential {flow.levels.length}-level approval hierarchy
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                if (approvalSubView === "leave") {
                                  setLeaveApprovalFlows(
                                    leaveApprovalFlows.filter((f) => f.id !== flow.id)
                                  );
                                } else {
                                  setReimbursementApprovalFlows(
                                    reimbursementApprovalFlows.filter((f) => f.id !== flow.id)
                                  );
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            {flow.levels.map((lvl: any, lIdx: number) => (
                              <div
                                key={lIdx}
                                className="flex items-start gap-3 text-xs p-3 rounded-lg bg-[#FAFBFD] border border-slate-200"
                              >
                                <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                  {lIdx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-800">
                                    Level {lIdx + 1}: {lvl.approver}
                                  </div>
                                  <div className="text-slate-500 text-[11px] mt-0.5">
                                    Policy: {lvl.policy}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: User Permission (Screenshots 1-3 Match 1:1) */}
          {activeTab === "User Permission" && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">User Permission</h3>
                <button
                  disabled={!isUserPermissionDirty}
                  onClick={() => alert(`User permissions updated for ${formData.name} to ${selectedUserRole}!`)}
                  className={`px-5 py-2 text-xs font-semibold rounded-md transition-colors ${
                    isUserPermissionDirty
                      ? "text-white bg-[#007BFF] hover:bg-blue-600 shadow-xs cursor-pointer"
                      : "text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  Update Details
                </button>
              </div>

              {/* Role Selection (Screenshot 1 Match) */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 items-start gap-4">
                  <label className="col-span-3 text-slate-700 font-bold text-xs pt-2">
                    <span className="text-red-500">*</span> Select User Role
                  </label>

                  <div className="col-span-9 space-y-2 text-xs">
                    {/* Role 1: Employee */}
                    <label
                      onClick={() => setSelectedUserRole("Employee")}
                      className={`block p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedUserRole === "Employee"
                          ? "bg-[#EBF5FF]/50 border-blue-400 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="userRole"
                          checked={selectedUserRole === "Employee"}
                          onChange={() => setSelectedUserRole("Employee")}
                          className="mt-0.5 text-[#007BFF] focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">Employee</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Can mark their own attendance
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Role 2: Branch Admin */}
                    <label
                      onClick={() => setSelectedUserRole("Branch Admin")}
                      className={`block p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedUserRole === "Branch Admin"
                          ? "bg-[#EBF5FF]/50 border-blue-400 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="userRole"
                          checked={selectedUserRole === "Branch Admin"}
                          onChange={() => setSelectedUserRole("Branch Admin")}
                          className="text-[#007BFF] focus:ring-blue-500"
                        />
                        <span className="font-medium text-slate-700 text-xs">
                          Branch Admin
                        </span>
                      </div>
                    </label>

                    {/* Role 3: Attendance Manager */}
                    <label
                      onClick={() => setSelectedUserRole("Attendance Manager")}
                      className={`block p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedUserRole === "Attendance Manager"
                          ? "bg-[#EBF5FF]/50 border-blue-400 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="userRole"
                          checked={selectedUserRole === "Attendance Manager"}
                          onChange={() => setSelectedUserRole("Attendance Manager")}
                          className="text-[#007BFF] focus:ring-blue-500"
                        />
                        <span className="font-medium text-slate-700 text-xs">
                          Attendance Manager
                        </span>
                      </div>
                    </label>

                    {/* Role 4: Advanced Attendance Manager */}
                    <label
                      onClick={() => setSelectedUserRole("Advanced Attendance Manager")}
                      className={`block p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedUserRole === "Advanced Attendance Manager"
                          ? "bg-[#EBF5FF]/50 border-blue-400 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="userRole"
                          checked={selectedUserRole === "Advanced Attendance Manager"}
                          onChange={() => setSelectedUserRole("Advanced Attendance Manager")}
                          className="text-[#007BFF] focus:ring-blue-500"
                        />
                        <span className="font-medium text-slate-700 text-xs">
                          Advanced Attendance Manager
                        </span>
                      </div>
                    </label>

                    {/* Role 5: Custom */}
                    <label
                      onClick={() => setSelectedUserRole("Custom")}
                      className={`block p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedUserRole === "Custom"
                          ? "bg-[#EBF5FF]/50 border-blue-400 shadow-xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="userRole"
                          checked={selectedUserRole === "Custom"}
                          onChange={() => setSelectedUserRole("Custom")}
                          className="mt-0.5 text-[#007BFF] focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-bold text-slate-800 text-xs">Custom</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Has privileges decided by the admin
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Custom Permission Matrix Table (Screenshots 2 & 3 Match) */}
              {selectedUserRole === "Custom" && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700">
                    Provide Custom Permissions below
                  </h4>

                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFD] text-slate-500 font-semibold border-b border-slate-200">
                          <th className="px-5 py-3 w-1/2"></th>
                          <th className="px-5 py-3 text-center">View</th>
                          <th className="px-5 py-3 text-center">Create/Edit</th>
                          <th className="px-5 py-3 text-center">Approve</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {/* Group 1: Attendance Data */}
                        <tr className="bg-slate-50/70 font-bold text-slate-800">
                          <td colSpan={4} className="px-5 py-2">
                            Attendance Data
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Staff Attendance Records</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Staff Attendance Records"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Staff Attendance Records": {
                                    ...customPermissions["Staff Attendance Records"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Staff Attendance Records"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Staff Attendance Records": {
                                    ...customPermissions["Staff Attendance Records"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Attendance Reports</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Attendance Reports"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Attendance Reports": {
                                    ...customPermissions["Attendance Reports"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Attendance Reports"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Attendance Reports": {
                                    ...customPermissions["Attendance Reports"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>

                        {/* Group 2: Attendance Settings */}
                        <tr className="bg-slate-50/70 font-bold text-slate-800">
                          <td colSpan={4} className="px-5 py-2">
                            Attendance Settings
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Work Timings & Roster</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Work Timings & Roster"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Work Timings & Roster": {
                                    ...customPermissions["Work Timings & Roster"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Work Timings & Roster"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Work Timings & Roster": {
                                    ...customPermissions["Work Timings & Roster"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Attendance Modes</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Attendance Modes"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Attendance Modes": {
                                    ...customPermissions["Attendance Modes"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Attendance Modes"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Attendance Modes": {
                                    ...customPermissions["Attendance Modes"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Automation Rules</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Automation Rules"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Automation Rules": {
                                    ...customPermissions["Automation Rules"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Automation Rules"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Automation Rules": {
                                    ...customPermissions["Automation Rules"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Shifts</td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Breaks</td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>

                        {/* Group 3: Leave Management */}
                        <tr className="bg-slate-50/70 font-bold text-slate-800">
                          <td colSpan={4} className="px-5 py-2">
                            Leave Management
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Leave Requests</td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Leave Requests"]?.approve || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Leave Requests": {
                                    ...customPermissions["Leave Requests"],
                                    approve: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Balances & Policies</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Balances & Policies"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Balances & Policies": {
                                    ...customPermissions["Balances & Policies"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Balances & Policies"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Balances & Policies": {
                                    ...customPermissions["Balances & Policies"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className="w-3.5 h-3.5 bg-slate-200 rounded inline-block opacity-40" />
                          </td>
                        </tr>

                        {/* Group 4: Reimbursement Management */}
                        <tr className="bg-slate-50/70 font-bold text-slate-800">
                          <td colSpan={4} className="px-5 py-2">
                            Reimbursement Management
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-2.5">Reimbursement Requests</td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Reimbursement Requests"]?.view || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Reimbursement Requests": {
                                    ...customPermissions["Reimbursement Requests"],
                                    view: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Reimbursement Requests"]?.edit || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Reimbursement Requests": {
                                    ...customPermissions["Reimbursement Requests"],
                                    edit: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={customPermissions["Reimbursement Requests"]?.approve || false}
                              onChange={(e) =>
                                setCustomPermissions({
                                  ...customPermissions,
                                  "Reimbursement Requests": {
                                    ...customPermissions["Reimbursement Requests"],
                                    approve: e.target.checked,
                                  },
                                })
                              }
                              className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: Attendance Details (Screenshot Match 1:1) */}
          {activeTab === "Attendance Details" && (
            <div className="space-y-6 max-w-3xl">
              {/* SUBVIEW 1: Landing List */}
              {attendanceDetailsSubView === "landing" && (
                <>
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">
                      Attendance Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Work Timings Card */}
                    <div
                      onClick={() => setAttendanceDetailsSubView("work_timings")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                          Work Timings
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-red-600 bg-red-50 border border-red-100">
                          New
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* 2. Attendance Modes Card */}
                    <div
                      onClick={() => setAttendanceDetailsSubView("attendance_modes")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                          Attendance Modes
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-red-600 bg-red-50 border border-red-100">
                          New
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* 3. Automation Rules Card */}
                    <div
                      onClick={() => setAttendanceDetailsSubView("automation_rules")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                          Automation Rules
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-red-600 bg-red-50 border border-red-100">
                          New
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* 4. Attendance Timezone Card (1:1 Screenshot Match) */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between relative">
                      <span className="font-semibold text-slate-800 text-xs">
                        Attendance Timezone
                      </span>
                      
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen);
                            setTimezoneSearchQuery("");
                          }}
                          className="px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <span>{attendanceTimezone}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isTimezoneDropdownOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Dropdown Popup exactly matching SalaryBox screenshot */}
                        {isTimezoneDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setIsTimezoneDropdownOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-blue-400/80 z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-100">
                              {/* Search Input */}
                              <div className="p-2 border-b border-slate-100 bg-white">
                                <div className="relative">
                                  <input
                                    type="text"
                                    autoFocus
                                    placeholder="Calcutta, Asia"
                                    value={timezoneSearchQuery}
                                    onChange={(e) => setTimezoneSearchQuery(e.target.value)}
                                    className="w-full pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white rounded border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-normal"
                                  />
                                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </div>

                              {/* Timezone List with region and GMT offsets */}
                              <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin divide-y divide-slate-50">
                                {TIMEZONE_OPTIONS.filter((tz) => {
                                  const fullLabel = `${tz.city}, ${tz.region} ${tz.code} ${tz.offset}`.toLowerCase();
                                  return fullLabel.includes(timezoneSearchQuery.toLowerCase());
                                }).map((tz) => {
                                  const label = `${tz.city}, ${tz.region}`;
                                  const isSelected = attendanceTimezone === label;
                                  return (
                                    <div
                                      key={`${tz.city}-${tz.region}`}
                                      onClick={() => {
                                        setAttendanceTimezone(label);
                                        setIsTimezoneDropdownOpen(false);
                                      }}
                                      className={`px-3.5 py-2.5 cursor-pointer hover:bg-blue-50/70 transition-colors ${
                                        isSelected ? "bg-blue-50/50" : ""
                                      }`}
                                    >
                                      <div className="font-bold text-slate-800 text-xs">
                                        {tz.city}, {tz.region}
                                      </div>
                                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        {tz.code} • {tz.offset}
                                      </div>
                                    </div>
                                  );
                                })}

                                {TIMEZONE_OPTIONS.filter((tz) => {
                                  const fullLabel = `${tz.city}, ${tz.region} ${tz.code} ${tz.offset}`.toLowerCase();
                                  return fullLabel.includes(timezoneSearchQuery.toLowerCase());
                                }).length === 0 && (
                                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                                    No timezones found
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 5. Staff can view own attendance Toggle Card */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <span className="font-semibold text-slate-800 text-xs">
                        Staff can view own attendance
                      </span>
                      <button
                        type="button"
                        onClick={() => setCanStaffViewOwnAttendance(!canStaffViewOwnAttendance)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          canStaffViewOwnAttendance ? "bg-[#007BFF]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            canStaffViewOwnAttendance ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* SUBVIEW 2: Work Timings (1:1 Screenshot Match) */}
              {attendanceDetailsSubView === "work_timings" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-base font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={() => setAttendanceDetailsSubView("landing")}
                        className="hover:text-[#007BFF] transition-colors cursor-pointer text-slate-600 font-bold"
                      >
                        Attendance Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-900 font-bold">Work Timings</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Work timings updated successfully!")}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Update Details
                    </button>
                  </div>

                  {/* Select Type Card */}
                  <div className="bg-[#EBF5FF]/50 border border-blue-200/80 rounded-xl p-3.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Select Type</span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="timingType"
                          value="Fixed"
                          checked={timingType === "Fixed"}
                          onChange={() => setTimingType("Fixed")}
                          className="text-[#007BFF] focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span>Fixed</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="timingType"
                          value="Flexible"
                          checked={timingType === "Flexible"}
                          onChange={() => setTimingType("Flexible")}
                          className="text-[#007BFF] focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                        <span>Flexible</span>
                      </label>
                    </div>
                  </div>

                  {/* Fixed Schedule Matrix */}
                  {timingType === "Fixed" && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="px-5 py-3 w-28">Day</th>
                            <th className="px-5 py-3 w-24 text-center">Weekoff</th>
                            <th className="px-5 py-3">Shifts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                            const sched = dailySchedules[day] || { isWeekoff: false, shifts: [] };
                            return (
                              <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-3 font-semibold text-slate-800">
                                  {day !== "Sun" && (
                                    <span className="text-red-500 font-bold mr-0.5">*</span>
                                  )}
                                  {day}
                                </td>
                                <td className="px-5 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={sched.isWeekoff}
                                    onChange={() => handleToggleWeekoff(day)}
                                    className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-5 py-3">
                                  {sched.isWeekoff ? (
                                    day === "Sun" ? (
                                      <select
                                        value={sched.weekoffType || "All sundays week off"}
                                        onChange={(e) =>
                                          handleSundayWeekoffTypeChange(e.target.value)
                                        }
                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      >
                                        <option>All sundays week off</option>
                                        <option>1st and 3rd Sunday week off</option>
                                        <option>2nd and 4th Sunday week off</option>
                                        <option>Alternate Sundays week off</option>
                                      </select>
                                    ) : (
                                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">
                                        Week Off
                                      </span>
                                    )
                                  ) : (
                                    <div className="flex flex-wrap items-center gap-2">
                                      {sched.shifts?.map((shift, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-1.5">
                                          <div
                                            onClick={() => handleOpenDayShiftsModal(day)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                            title="Click to select shift"
                                          >
                                            <span>{shift.name}</span>
                                            <span className="text-slate-300 font-normal">|</span>
                                            <span>{shift.timing}</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleRemoveShift(day, sIdx)}
                                            className="w-5 h-5 rounded-full border border-red-400 text-red-500 flex items-center justify-center hover:bg-red-50 cursor-pointer transition-colors"
                                            title="Remove shift"
                                          >
                                            <Minus className="w-3 h-3 stroke-[2.5]" />
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => handleAddShift(day)}
                                        className="w-5 h-5 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors ml-0.5"
                                        title="Add shift"
                                      >
                                        <Plus className="w-3 h-3 stroke-[2.5]" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Flexible Schedule Matrix */}
                  {timingType === "Flexible" && (
                    <div className="space-y-4">
                      {/* 1. Daily Required Hours */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Daily Working Hours Requirement
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-600 font-medium text-xs mb-1">
                              Minimum Hours per Day
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="24"
                                value={flexibleHours}
                                onChange={(e) => setFlexibleHours(e.target.value)}
                                className="w-20 px-3 py-1.5 text-xs rounded border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <span className="text-xs text-slate-500 font-medium">Hours</span>
                              <input
                                type="text"
                                value={flexibleMins}
                                onChange={(e) => setFlexibleMins(e.target.value)}
                                className="w-16 px-3 py-1.5 text-xs rounded border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <span className="text-xs text-slate-500 font-medium">Mins</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium text-xs mb-1">
                              Half Day Minimum Threshold
                            </label>
                            <input
                              type="text"
                              defaultValue="4.5 Hours"
                              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-slate-50 text-slate-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Core Window */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Office Timing & Core Working Window
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Mandatory Core Hours
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={coreHoursStart}
                                onChange={(e) => setCoreHoursStart(e.target.value)}
                                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono"
                              />
                              <span className="text-slate-400">to</span>
                              <input
                                type="text"
                                value={coreHoursEnd}
                                onChange={(e) => setCoreHoursEnd(e.target.value)}
                                className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-mono"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Break Duration Allowed
                            </label>
                            <select className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-xs">
                              <option>30 Minutes (Unpaid)</option>
                              <option defaultValue="60 Minutes (Unpaid)">60 Minutes (Unpaid)</option>
                              <option>90 Minutes (Unpaid)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 3. Flexible Week Off Selector */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Weekly Off Days
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                            const isOff = flexibleWeekoffDays.includes(d);
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  if (isOff) {
                                    setFlexibleWeekoffDays(
                                      flexibleWeekoffDays.filter((x) => x !== d)
                                    );
                                  } else {
                                    setFlexibleWeekoffDays([...flexibleWeekoffDays, d]);
                                  }
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  isOff
                                    ? "bg-[#007BFF] text-white shadow-xs"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {d} {isOff ? "✓ (Off)" : ""}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBVIEW 3: Attendance Modes (1:1 Screenshot Match) */}
              {attendanceDetailsSubView === "attendance_modes" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-base font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={() => setAttendanceDetailsSubView("landing")}
                        className="hover:text-[#007BFF] transition-colors cursor-pointer text-[#007BFF] font-bold underline-offset-2 hover:underline"
                      >
                        Attendance Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-700 font-bold">Attendance Modes</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {/* Top Header: Allow punch in from Staff App */}
                    <div className="bg-[#F0F7FF] px-5 py-3.5 flex items-center justify-between border-b border-blue-100/70">
                      <span className="text-xs font-semibold text-slate-800">
                        Allow punch in from Staff App
                      </span>
                      <button
                        type="button"
                        onClick={() => setAllowPunchFromStaffApp(!allowPunchFromStaffApp)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          allowPunchFromStaffApp ? "bg-[#007BFF]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            allowPunchFromStaffApp ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {allowPunchFromStaffApp && (
                      <div className="divide-y divide-slate-100">
                        {/* 1. Selfie Attendance */}
                        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <ScanFace className="w-4 h-4 text-slate-700 stroke-[2]" />
                            <span className="text-xs font-medium text-slate-800">
                              Selfie Attendance
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSelfieAttendance(!isSelfieAttendance)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isSelfieAttendance ? "bg-[#007BFF]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isSelfieAttendance ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* 2. QR Attendance */}
                        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <QrCode className="w-4 h-4 text-slate-700 stroke-[2]" />
                            <span className="text-xs font-medium text-slate-800">
                              QR Attendance
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsQrAttendance(!isQrAttendance)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isQrAttendance ? "bg-[#007BFF]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isQrAttendance ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* 3. GPS Attendance */}
                        <div className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <Compass className="w-4 h-4 text-slate-700 stroke-[2]" />
                            <span className="text-xs font-medium text-slate-800">
                              GPS Attendance
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsGpsAttendance(!isGpsAttendance)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isGpsAttendance ? "bg-[#007BFF]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                isGpsAttendance ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Mark attendance from Section */}
                        {isGpsAttendance && (
                          <div className="p-5 space-y-3 bg-white">
                            <div className="text-xs font-bold text-slate-800">
                              Mark attendance from
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setMarkAttendanceFrom("From Office")}
                                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                                  markAttendanceFrom === "From Office"
                                    ? "border-blue-500 text-blue-600 bg-blue-50/30 ring-1 ring-blue-500"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    markAttendanceFrom === "From Office"
                                      ? "border-blue-500"
                                      : "border-slate-400"
                                  }`}
                                >
                                  {markAttendanceFrom === "From Office" && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                  )}
                                </span>
                                <span>From Office</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMarkAttendanceFrom("From Anywhere")}
                                className={`px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                                  markAttendanceFrom === "From Anywhere"
                                    ? "border-blue-500 text-blue-600 bg-blue-50/30 ring-1 ring-blue-500"
                                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    markAttendanceFrom === "From Anywhere"
                                      ? "border-blue-500"
                                      : "border-slate-400"
                                  }`}
                                >
                                  {markAttendanceFrom === "From Anywhere" && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                  )}
                                </span>
                                <span>From Anywhere</span>
                              </button>
                            </div>

                            {markAttendanceFrom === "From Office" && (
                              <div className="p-4 rounded-xl border border-slate-200 bg-[#FAFAFA]/50 flex items-center justify-between text-xs mt-3">
                                <div className="space-y-1">
                                  <div className="font-bold text-slate-800 text-xs">
                                    VIJAYAWADA
                                  </div>
                                  <div className="text-slate-500 text-[11px]">
                                    GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-slate-800 text-xs">
                                    20m
                                  </div>
                                  <div className="text-slate-500 text-[11px]">
                                    Allowed Radius
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBVIEW 4: Automation Rules (1:1 Screenshot Match) */}
              {attendanceDetailsSubView === "automation_rules" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-base font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={() => setAttendanceDetailsSubView("landing")}
                        className="hover:text-[#007BFF] transition-colors cursor-pointer text-[#007BFF] font-bold underline-offset-2 hover:underline"
                      >
                        Attendance Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-700 font-bold">Automation Rules</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="divide-y divide-slate-100 text-xs">
                      {/* Rule 1: Auto Present at day start */}
                      <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                        <span className="font-medium text-slate-800">
                          Auto Present at day start
                        </span>
                        <button
                          type="button"
                          onClick={() => setAutoPresentAtDayStart(!autoPresentAtDayStart)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            autoPresentAtDayStart ? "bg-[#007BFF]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              autoPresentAtDayStart ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Rule 2: Present on Punch In */}
                      <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                        <span className="font-medium text-slate-800">
                          Present on Punch In
                        </span>
                        <button
                          type="button"
                          onClick={() => setPresentOnPunchIn(!presentOnPunchIn)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            presentOnPunchIn ? "bg-[#007BFF]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              presentOnPunchIn ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Rule 3: Auto half day if late by */}
                      <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                        <span className="font-medium text-slate-800">
                          Auto half day if late by
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenAutomationRuleModal(
                              "autoHalfDayIfLateBy",
                              "Auto half day if late by"
                            )
                          }
                          className="px-4 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                        >
                          {autoHalfDayIfLateBy
                            ? `${autoHalfDayIfLateBy.hours ? `${autoHalfDayIfLateBy.hours} hrs ` : ""}${
                                autoHalfDayIfLateBy.minutes ? `${autoHalfDayIfLateBy.minutes} mins` : ""
                              }`
                            : "Not Set"}
                        </button>
                      </div>

                      {/* Rule 4: Mandatory half day hours */}
                      <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                        <span className="font-medium text-slate-800">
                          Mandatory half day hours
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenAutomationRuleModal(
                              "mandatoryHalfDayHours",
                              "Mandatory half day hours"
                            )
                          }
                          className="px-4 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                        >
                          {mandatoryHalfDayHours
                            ? `${mandatoryHalfDayHours.hours ? `${mandatoryHalfDayHours.hours} hrs ` : ""}${
                                mandatoryHalfDayHours.minutes
                                  ? `${mandatoryHalfDayHours.minutes} mins`
                                  : ""
                              }`
                            : "Not Set"}
                        </button>
                      </div>

                      {/* Rule 5: Mandatory full day hours */}
                      <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                        <span className="font-medium text-slate-800">
                          Mandatory full day hours
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenAutomationRuleModal(
                              "mandatoryFullDayHours",
                              "Mandatory full day hours"
                            )
                          }
                          className="px-4 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
                        >
                          {mandatoryFullDayHours
                            ? `${mandatoryFullDayHours.hours ? `${mandatoryFullDayHours.hours} hrs ` : ""}${
                                mandatoryFullDayHours.minutes
                                  ? `${mandatoryFullDayHours.minutes} mins`
                                  : ""
                              }`
                            : "Not Set"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 1:1 Automation Rule Duration Modal (Screenshot Match) */}
          {isAutomationRuleModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Title */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {activeAutomationRuleTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAutomationRuleModalOpen(false)}
                    className="w-5 h-5 rounded-full bg-slate-400 text-white flex items-center justify-center hover:bg-slate-500 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-3">
                  <div className="text-xs font-semibold text-slate-700">
                    Select Duration
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="text"
                      maxLength={2}
                      value={automationModalHours}
                      onChange={(e) => setAutomationModalHours(e.target.value)}
                      className="w-14 h-9 border border-slate-300 rounded text-center font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="mr-3">hours</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={automationModalMinutes}
                      onChange={(e) => setAutomationModalMinutes(e.target.value)}
                      className="w-14 h-9 border border-slate-300 rounded text-center font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span>minutes</span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTurnOffAutomationRule}
                    className="px-5 py-1.5 text-xs font-medium text-red-600 bg-red-50/60 border border-red-200 rounded-md hover:bg-red-100/60 transition-colors cursor-pointer"
                  >
                    Turn Off
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAutomationRule}
                    className="px-6 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1:1 Shift Selection Modal (Screenshot Match) */}
          {isShiftModalOpen && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Title */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 text-sm">
                    {dayNameMap[editingShiftDay] || editingShiftDay} - Shifts
                  </h3>
                </div>

                {/* Shift Options List */}
                <div className="divide-y divide-slate-100">
                  {availableShifts.map((s) => {
                    const isChecked = selectedShiftIdsInModal.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleToggleModalShift(s.id)}
                        className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs font-normal text-slate-800">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-600 font-mono text-[11px]">{s.timing}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleModalShift(s.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* + Add Shift Action */}
                {!isAddCustomShiftInline ? (
                  <div className="px-6 py-3.5 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddCustomShiftInline(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Shift</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3 text-xs">
                    <div className="font-bold text-slate-700">Add New Shift</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Shift Name (e.g. Night Shift)"
                        value={newCustomShiftName}
                        onChange={(e) => setNewCustomShiftName(e.target.value)}
                        className="col-span-2 px-3 py-1.5 rounded border border-slate-300 bg-white"
                      />
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">Start Time</label>
                        <input
                          type="text"
                          value={newCustomShiftStart}
                          onChange={(e) => setNewCustomShiftStart(e.target.value)}
                          className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 block mb-0.5">End Time</label>
                        <input
                          type="text"
                          value={newCustomShiftEnd}
                          onChange={(e) => setNewCustomShiftEnd(e.target.value)}
                          className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddCustomShiftInline(false)}
                        className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateNewShift}
                        className="px-3 py-1 rounded bg-[#007BFF] text-white font-semibold hover:bg-blue-600 text-xs"
                      >
                        Save Shift
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsShiftModalOpen(false)}
                    className="px-5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModalShifts}
                    className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: Salary Details (1:1 Match with Screenshots) */}
          {activeTab === "Salary Details" && (
            <div className="space-y-6 max-w-4xl pb-16">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Salary Details
                </h3>
                <button
                  type="button"
                  onClick={() => alert("Salary Details Updated Successfully!")}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Update Details
                </button>
              </div>

              {/* Row 1: Effective Date, Salary Type, Salary Structure, CTC Amount */}
              <div className="grid grid-cols-4 gap-4 items-start">
                {/* 1. Effective Date of Change */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 font-medium text-xs">
                    Effective Date of Change
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={salaryEffectiveDate}
                      onChange={(e) => setSalaryEffectiveDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Salary Type */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 font-medium text-xs">
                    Salary Type
                  </label>
                  <div className="relative">
                    <select
                      value={salaryType}
                      onChange={(e) => setSalaryType(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      <option>Per Month</option>
                      <option>Per Day</option>
                      <option>Per Hour</option>
                      <option>Per Week</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Salary Structure (with SalaryBox provided... / Custom dropdown) */}
                <div className="space-y-1.5 relative">
                  <label className="block text-slate-600 font-medium text-xs">
                    Salary Structure
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSalaryStructureDropdownOpen(!isSalaryStructureDropdownOpen)}
                      className="w-full px-3 py-2 rounded-md border border-blue-400 bg-white text-xs text-slate-800 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                    >
                      <span className="truncate">{salaryStructure}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    {isSalaryStructureDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsSalaryStructureDropdownOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-xl border border-slate-200 z-40 py-1 text-xs">
                          <div
                            onClick={() => {
                              setSalaryStructure("SalaryBox provided...");
                              setIsSalaryStructureDropdownOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${
                              salaryStructure === "SalaryBox provided..." ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                            }`}
                          >
                            SalaryBox provided...
                          </div>
                          <div
                            onClick={() => {
                              setSalaryStructure("Custom");
                              setIsSalaryStructureDropdownOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-[#007BFF] transition-colors ${
                              salaryStructure === "Custom" ? "bg-slate-50 font-semibold text-slate-900" : "text-slate-700"
                            }`}
                          >
                            Custom
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 4. CTC Amount */}
                <div className="space-y-1.5">
                  <label className="block text-slate-600 font-medium text-xs">
                    CTC Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                      ₹
                    </span>
                    <input
                      type="text"
                      value={ctcAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setCtcAmount(val);
                        const num = Number(val) || 0;
                        setSalaryEarnings({
                          basic: String(Math.round(num * 0.5)),
                          hra: String(Math.round(num * 0.25)),
                          travelAllowance: String(Math.round(num * 0.1)),
                          specialAllowance: String(Math.round(num * 0.15)),
                        });
                      }}
                      className="w-full pl-6 pr-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Earnings Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-800">Earnings</h4>

                {/* Earnings Table Header */}
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-800 pb-2 border-b border-slate-100">
                  <div className="col-span-5">Heads</div>
                  <div className="col-span-4">Calculation</div>
                  <div className="col-span-3 text-right pr-2">Amount</div>
                </div>

                {/* Earnings Rows */}
                <div className="space-y-3 text-xs">
                  {/* Basic */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Basic</div>
                    <div className="col-span-4">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 flex items-center justify-between">
                        <span>On Attendance</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 text-right font-medium">
                        ₹ {salaryEarnings.basic}
                      </div>
                    </div>
                  </div>

                  {/* HRA */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">HRA</div>
                    <div className="col-span-4">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 flex items-center justify-between">
                        <span>On Attendance</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 text-right font-medium">
                        ₹ {salaryEarnings.hra}
                      </div>
                    </div>
                  </div>

                  {/* Travel Allowance */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Travel Allowance</div>
                    <div className="col-span-4">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 flex items-center justify-between">
                        <span>On Attendance</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 text-right font-medium">
                        ₹ {salaryEarnings.travelAllowance}
                      </div>
                    </div>
                  </div>

                  {/* Special Allowance */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Special Allowance</div>
                    <div className="col-span-4">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 flex items-center justify-between">
                        <span>On Attendance</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-2 rounded-md border border-slate-200 bg-slate-50/70 text-slate-500 text-right font-medium">
                        ₹ {salaryEarnings.specialAllowance}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliances Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Compliances</h4>

                {/* Compliances Header */}
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-800 pb-2 border-b border-slate-100">
                  <div className="col-span-5">Employer Contributions</div>
                  <div className="col-span-3">Calculation</div>
                  <div className="col-span-2 text-center">Included in CTC</div>
                  <div className="col-span-2 text-right pr-2">Amount</div>
                </div>

                {/* Employer Contributions Rows */}
                <div className="space-y-3 text-xs">
                  {/* Employer PF */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employer PF</div>
                    <div className="col-span-3">
                      <div className="relative">
                        <select
                          value={employerPfCalc}
                          onChange={(e) => setEmployerPfCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>12% of Basic</option>
                          <option>12% of (Basic + DA)</option>
                          <option>Custom</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="checkbox"
                        checked={isEmployerPfIncludedInCtc}
                        onChange={(e) => setIsEmployerPfIncludedInCtc(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employerPfAmount}
                      </div>
                    </div>
                  </div>

                  {/* PF EDLI & Admin Charges */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">PF EDLI & Admin Charges</div>
                    <div className="col-span-3">
                      <div className="relative">
                        <select
                          value={employerPfEdliCalc}
                          onChange={(e) => setEmployerPfEdliCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>1% of Basic</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-slate-400 font-medium text-xs">
                      N/A
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employerPfEdliAmount}
                      </div>
                    </div>
                  </div>

                  {/* Employer ESI */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employer ESI</div>
                    <div className="col-span-3">
                      <div className="relative">
                        <select
                          value={employerEsiCalc}
                          onChange={(e) => setEmployerEsiCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>3.25% of Gross</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="checkbox"
                        checked={isEmployerEsiIncludedInCtc}
                        onChange={(e) => setIsEmployerEsiIncludedInCtc(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employerEsiAmount}
                      </div>
                    </div>
                  </div>

                  {/* Employer LWF */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employer LWF</div>
                    <div className="col-span-3">
                      <div className="relative">
                        <select
                          value={employerLwfCalc}
                          onChange={(e) => setEmployerLwfCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>State Surcharge</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <input
                        type="checkbox"
                        checked={isEmployerLwfIncludedInCtc}
                        onChange={(e) => setIsEmployerLwfIncludedInCtc(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employerLwfAmount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Contributions Sub-Header */}
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-800 pt-4 pb-2 border-b border-slate-100">
                  <div className="col-span-5">Employee Contributions</div>
                  <div className="col-span-4">Calculation</div>
                  <div className="col-span-3 text-right pr-2">Amount</div>
                </div>

                {/* Employee Contributions Rows */}
                <div className="space-y-3 text-xs">
                  {/* Employee PF */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employee PF</div>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          value={employeePfCalc}
                          onChange={(e) => setEmployeePfCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>12% of Basic</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employeePfAmount}
                      </div>
                    </div>
                  </div>

                  {/* Employee ESI */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employee ESI</div>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          value={employeeEsiCalc}
                          onChange={(e) => setEmployeeEsiCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>0.75% of Gross</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employeeEsiAmount}
                      </div>
                    </div>
                  </div>

                  {/* Professional Tax */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Professional Tax</div>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          value={professionalTaxCalc}
                          onChange={(e) => setProfessionalTaxCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>State PT Slab</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-3 text-right text-slate-400 text-xs font-medium pr-2">
                      System calculated
                    </div>
                  </div>

                  {/* Employee LWF */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">Employee LWF</div>
                    <div className="col-span-4">
                      <div className="relative">
                        <select
                          value={employeeLwfCalc}
                          onChange={(e) => setEmployeeLwfCalc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                        >
                          <option>None</option>
                          <option>State Surcharge</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50/70 text-slate-400 text-right font-medium">
                        ₹ {employeeLwfAmount}
                      </div>
                    </div>
                  </div>

                  {/* TDS */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5 font-medium text-slate-700">TDS</div>
                    <div className="col-span-4"></div>
                    <div className="col-span-3 flex items-center justify-end gap-1.5 text-slate-500 text-xs font-medium pr-1">
                      <span>System Calculated</span>
                      <Info className="w-3.5 h-3.5 text-[#007BFF]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Deductions</h4>

                {/* Deductions Header */}
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-800 pb-2 border-b border-slate-100">
                  <div className="col-span-5">Heads</div>
                  <div className="col-span-4">Calculation</div>
                  <div className="col-span-3 text-right pr-2">Amount</div>
                </div>

                {/* Deductions List or Empty State */}
                {salaryDeductions.length === 0 ? (
                  <div className="py-2 text-xs text-slate-400 font-medium">
                    No Deductions Added
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    {salaryDeductions.map((ded) => (
                      <div key={ded.id} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 font-medium text-slate-700">{ded.name}</div>
                        <div className="col-span-4 text-slate-600">{ded.calculation}</div>
                        <div className="col-span-3 flex items-center justify-end gap-2 pr-2">
                          <span className="font-medium text-slate-800">₹ {ded.amount}</span>
                          <button
                            type="button"
                            onClick={() => setSalaryDeductions(salaryDeductions.filter((d) => d.id !== ded.id))}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* + Add Deduction Action */}
                <button
                  type="button"
                  onClick={() => {
                    setNewDeductionName("");
                    setNewDeductionAmount("");
                    setIsAddDeductionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer pt-1"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Deduction</span>
                </button>
              </div>

              {/* Bottom Sticky Total CTC Footer Bar */}
              <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <div>Total CTC: -</div>
                <div className="text-sm font-black text-slate-900">
                  ₹ {ctcAmount ? Number(ctcAmount).toLocaleString("en-IN") : "0"}.00 / Month
                </div>
              </div>
            </div>
          )}

          {/* Add Deduction Modal */}
          {isAddDeductionModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
              <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-xs">Add Deduction</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddDeductionModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Deduction Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Loan Recovery, Advance Deduction"
                      value={newDeductionName}
                      onChange={(e) => setNewDeductionName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Calculation Type</label>
                    <select
                      value={newDeductionCalc}
                      onChange={(e) => setNewDeductionCalc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white cursor-pointer"
                    >
                      <option>Fixed Amount</option>
                      <option>Percentage of Basic</option>
                      <option>Percentage of Gross</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newDeductionAmount}
                      onChange={(e) => setNewDeductionAmount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddDeductionModalOpen(false)}
                      className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newDeductionName && newDeductionAmount) {
                          setSalaryDeductions([
                            ...salaryDeductions,
                            {
                              id: String(Date.now()),
                              name: newDeductionName,
                              calculation: newDeductionCalc,
                              amount: newDeductionAmount,
                            },
                          ]);
                          setIsAddDeductionModalOpen(false);
                        }
                      }}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: Additional Settings (1:1 Screenshot Match) */}
          {activeTab === "Additional Settings" && (
            <div className="space-y-6 max-w-4xl pb-16">
              {/* Header */}
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  Additional Settings
                </h3>
              </div>

              {/* Settings Cards List */}
              <div className="space-y-3">
                {/* 1. Can use Location Tracking */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-semibold text-slate-700 text-xs">
                    Can use Location Tracking
                  </span>
                  
                  {/* Disabled cursor-not-allowed toggle for regular employee */}
                  <div
                    title="Employee does not have permission to enable Location Tracking"
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out opacity-80"
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out translate-x-0"
                    />
                  </div>
                </div>

                {/* 2. Can use CRM Lite */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <span className="font-semibold text-slate-700 text-xs">
                    Can use CRM Lite
                  </span>
                  
                  {/* Disabled cursor-not-allowed toggle for regular employee */}
                  <div
                    title="Employee does not have permission to enable CRM Lite"
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out opacity-80"
                  >
                    <span
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out translate-x-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: Documents (1:1 Screenshot Match) */}
          {activeTab === "Documents" && (
            <div className="space-y-6 max-w-4xl pb-16">
              {/* SUBVIEW 1: Documents Root View */}
              {documentsSubView === "root" && (
                <>
                  {/* Header with Title and Add Document Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">
                      Documents
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUploadDocType("");
                        setIsUploadDocumentModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Document</span>
                    </button>
                  </div>

                  {/* Documents Table Container */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-700">
                      <div className="col-span-3">Document Type</div>
                      <div className="col-span-5">File Name</div>
                      <div className="col-span-2 text-center">Added On</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Salary Slip Default Folder Row */}
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                        <div className="col-span-3 font-medium text-slate-800">
                          Salary Slip
                        </div>
                        <div className="col-span-5">
                          <button
                            type="button"
                            onClick={() => setDocumentsSubView("salary_slips")}
                            className="flex items-center gap-2.5 text-slate-800 hover:text-[#007BFF] cursor-pointer group transition-colors"
                          >
                            <div className="w-6 h-5 rounded bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shadow-2xs">
                              <Folder className="w-3.5 h-3.5 fill-[#F59E0B]" />
                            </div>
                            <span className="font-medium group-hover:underline">
                              Salary Slip
                            </span>
                          </button>
                        </div>
                        <div className="col-span-2 text-center text-slate-400 font-medium">
                          -
                        </div>
                        <div className="col-span-2 text-right text-slate-400 font-medium">
                          -
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* SUBVIEW 2: Inside Salary Slips Folder (Screenshot 4 Match) */}
              {documentsSubView === "salary_slips" && (
                <>
                  {/* Header with Back Arrow and Add Salary Slip Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDocumentsSubView("root")}
                        className="p-1 -ml-1 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <h3 className="text-base font-bold text-slate-800">
                        Salary Slips
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddSalarySlipModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add Salary Slip</span>
                    </button>
                  </div>

                  {/* Salary Slips Table Container */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-700">
                      <div className="col-span-3">Document Type</div>
                      <div className="col-span-5">File Name</div>
                      <div className="col-span-2 text-center">Added On</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {salarySlipsList.length === 0 ? (
                      /* Empty State matching Screenshot 4 ("No Data") */
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-2.5 bg-white">
                        <div className="w-14 h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-300">
                          <FileText className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          No Data
                        </span>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 text-xs">
                        {salarySlipsList.map((slip) => (
                          <div
                            key={slip.id}
                            className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="col-span-3 font-medium text-slate-800">
                              {slip.docType}
                            </div>
                            <div className="col-span-5 font-medium text-slate-700 flex items-center gap-2">
                              <File className="w-3.5 h-3.5 text-[#007BFF]" />
                              <span>{slip.fileName}</span>
                            </div>
                            <div className="col-span-2 text-center text-slate-500">
                              {slip.addedOn}
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setSalarySlipsList(
                                    salarySlipsList.filter((s) => s.id !== slip.id)
                                  )
                                }
                                className="text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* MODAL: Upload Document Modal (1:1 Screenshot 2 Match) */}
          {isUploadDocumentModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Upload Document
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsUploadDocumentModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  {/* Select a document Dropdown */}
                  <div className="relative">
                    <div
                      onClick={() => setIsDocTypeDropdownOpen(!isDocTypeDropdownOpen)}
                      className="w-full px-3.5 py-2 rounded-md border border-slate-300 bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <span className={selectedUploadDocType ? "text-slate-800 font-medium" : "text-slate-400"}>
                        {selectedUploadDocType || "Select a document"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>

                    {isDocTypeDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsDocTypeDropdownOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-xl border border-slate-200 z-40 py-1 text-xs">
                          {["Offer Letter", "Relieving Letter", "Experience Letter", "Aadhaar Card", "PAN Card", "Driving License", "Educational Certificate"].map((t) => (
                            <div
                              key={t}
                              onClick={() => {
                                setSelectedUploadDocType(t);
                                setIsDocTypeDropdownOpen(false);
                              }}
                              className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upload a file Button */}
                  <div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#007BFF] text-white font-semibold text-xs hover:bg-blue-600 shadow-xs cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            alert(`File selected: ${e.target.files[0].name}`);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsUploadDocumentModalOpen(false)}
                    className="px-4 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadDocumentModalOpen(false);
                      alert("Document uploaded successfully!");
                    }}
                    className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: Add Salary Slip Modal */}
          {isAddSalarySlipModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 text-xs">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">
                    Add Salary Slip
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddSalarySlipModalOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      Salary Month & Year
                    </label>
                    <input
                      type="text"
                      value={newSlipMonth}
                      onChange={(e) => setNewSlipMonth(e.target.value)}
                      placeholder="e.g. Aug 2026"
                      className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#007BFF] text-white font-semibold text-xs hover:bg-blue-600 shadow-xs cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Upload Salary Slip PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setSalarySlipsList([
                              ...salarySlipsList,
                              {
                                id: String(Date.now()),
                                docType: "Salary Slip",
                                fileName: file.name,
                                addedOn: new Date().toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }),
                              },
                            ]);
                            setIsAddSalarySlipModalOpen(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAddSalarySlipModalOpen(false)}
                    className="px-4 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: Penalty & Overtime Details (1:1 Screenshot Match) */}
          {activeTab === "Penalty & Overtime Details" && (
            <div className="space-y-6 max-w-4xl pb-16">
              {/* SUBVIEW 1: Landing Root List (Screenshot 1) */}
              {penaltySubView === "root" && (
                <>
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-800">
                      Penalty & Overtime Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* 1. Early Leaving Policy Card */}
                    <div
                      onClick={() => setPenaltySubView("early_leaving")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="font-medium text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                        Early Leaving Policy
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* 2. Late Coming Policy Card */}
                    <div
                      onClick={() => setPenaltySubView("late_coming")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="font-medium text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                        Late Coming Policy
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>

                    {/* 3. Overtime Policy Card */}
                    <div
                      onClick={() => setPenaltySubView("overtime")}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="font-medium text-slate-800 text-xs group-hover:text-[#007BFF] transition-colors">
                        Overtime Policy
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition-colors" />
                    </div>
                  </div>
                </>
              )}

              {/* SUBVIEW 2: Early Leaving Policy (Screenshot 4) */}
              {penaltySubView === "early_leaving" && (
                <div className="space-y-5">
                  {/* Breadcrumb Header & Update Details */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPenaltySubView("root")}
                        className="text-[#007BFF] font-medium hover:underline cursor-pointer"
                      >
                        Penalty & Overtime Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-700 font-bold">Early Leaving Policy</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert("Early Leaving Policy updated successfully!")}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Update Details
                    </button>
                  </div>

                  {/* Early Leaving Form Controls */}
                  <div className="max-w-md mx-auto space-y-6 pt-4 text-xs">
                    {/* 1. Allowed Early Leaving Days */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Allowed Early Leaving Days <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={earlyLeavingAllowedDays}
                          onChange={(e) => setEarlyLeavingAllowedDays(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-3 py-2 pr-12 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                          days
                        </span>
                      </div>
                    </div>

                    {/* 2. Only deduct if they leave earlier than */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Only deduct if they leave earlier than <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={earlyLeavingOnlyDeductIfEarlierThan}
                          onChange={(e) => setEarlyLeavingOnlyDeductIfEarlierThan(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-3 py-2 pr-12 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                          mins
                        </span>
                      </div>
                    </div>

                    {/* 3. Change deduction based on how early they leave? */}
                    <div className="space-y-2.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Change deduction based on how early they leave? <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Option 1 (Selected by default) */}
                      <div
                        onClick={() => setEarlyLeavingDeductionMode("fixed")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          earlyLeavingDeductionMode === "fixed"
                            ? "border-blue-300 bg-blue-50/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="earlyLeavingDeductionMode"
                            checked={earlyLeavingDeductionMode === "fixed"}
                            onChange={() => setEarlyLeavingDeductionMode("fixed")}
                            className="mt-0.5 w-3.5 h-3.5 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-slate-800 font-medium text-xs">
                            No, use a fixed deduction for early leaving
                          </span>
                        </div>
                      </div>

                      {/* Option 2 */}
                      <div
                        onClick={() => setEarlyLeavingDeductionMode("dynamic")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          earlyLeavingDeductionMode === "dynamic"
                            ? "border-blue-300 bg-blue-50/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="earlyLeavingDeductionMode"
                            checked={earlyLeavingDeductionMode === "dynamic"}
                            onChange={() => setEarlyLeavingDeductionMode("dynamic")}
                            className="mt-0.5 w-3.5 h-3.5 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-slate-700 font-normal text-xs">
                            Yes, deduct based on how early they left
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Deduction & Amount */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="block text-slate-600 font-medium text-xs">
                          Deduction <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={earlyLeavingDeductionType}
                            onChange={(e) => setEarlyLeavingDeductionType(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                          >
                            <option>Fixed Daily Rate</option>
                            <option>Fixed Hourly Rate</option>
                            <option>Half Day Salary</option>
                            <option>Full Day Salary</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-600 font-medium text-xs">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={earlyLeavingDeductionAmount}
                            onChange={(e) => setEarlyLeavingDeductionAmount(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full pl-6 pr-12 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                            /day
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 3: Late Coming Policy (Screenshot 3) */}
              {penaltySubView === "late_coming" && (
                <div className="space-y-5">
                  {/* Breadcrumb Header & Update Details */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPenaltySubView("root")}
                        className="text-[#007BFF] font-medium hover:underline cursor-pointer"
                      >
                        Penalty & Overtime Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-700 font-bold">Late Coming Policy</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert("Late Coming Policy updated successfully!")}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Update Details
                    </button>
                  </div>

                  {/* Late Coming Form Controls */}
                  <div className="max-w-md mx-auto space-y-6 pt-4 text-xs">
                    {/* 1. Allowed Late Days */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Allowed Late Days <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lateComingAllowedDays}
                          onChange={(e) => setLateComingAllowedDays(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-3 py-2 pr-12 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                          days
                        </span>
                      </div>
                    </div>

                    {/* 2. Only deduct if late by more than */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Only deduct if late by more than <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lateComingOnlyDeductIfLateBy}
                          onChange={(e) => setLateComingOnlyDeductIfLateBy(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-3 py-2 pr-12 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                          mins
                        </span>
                      </div>
                    </div>

                    {/* 3. Change deduction based on how late they arrive? */}
                    <div className="space-y-2.5">
                      <label className="block text-slate-600 font-medium text-xs">
                        Change deduction based on how late they arrive? <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Option 1 (Selected by default) */}
                      <div
                        onClick={() => setLateComingDeductionMode("fixed")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          lateComingDeductionMode === "fixed"
                            ? "border-blue-300 bg-blue-50/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="lateComingDeductionMode"
                            checked={lateComingDeductionMode === "fixed"}
                            onChange={() => setLateComingDeductionMode("fixed")}
                            className="mt-0.5 w-3.5 h-3.5 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-slate-800 font-medium text-xs">
                            No, use a fixed deduction for late arrival
                          </span>
                        </div>
                      </div>

                      {/* Option 2 */}
                      <div
                        onClick={() => setLateComingDeductionMode("dynamic")}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          lateComingDeductionMode === "dynamic"
                            ? "border-blue-300 bg-blue-50/20"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="lateComingDeductionMode"
                            checked={lateComingDeductionMode === "dynamic"}
                            onChange={() => setLateComingDeductionMode("dynamic")}
                            className="mt-0.5 w-3.5 h-3.5 text-[#007BFF] focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-slate-700 font-normal text-xs">
                            Yes, deduct based on how late they arrived
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Deduction & Amount */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="block text-slate-600 font-medium text-xs">
                          Deduction <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={lateComingDeductionType}
                            onChange={(e) => setLateComingDeductionType(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                          >
                            <option>Fixed Daily Rate</option>
                            <option>Fixed Hourly Rate</option>
                            <option>Half Day Salary</option>
                            <option>Full Day Salary</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-600 font-medium text-xs">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={lateComingDeductionAmount}
                            onChange={(e) => setLateComingDeductionAmount(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full pl-6 pr-12 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                            /day
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 4: Overtime Policy (Screenshot 2) */}
              {penaltySubView === "overtime" && (
                <div className="space-y-5">
                  {/* Breadcrumb Header & Update Details */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPenaltySubView("root")}
                        className="text-[#007BFF] font-medium hover:underline cursor-pointer"
                      >
                        Penalty & Overtime Details
                      </button>
                      <span className="text-slate-400 font-normal">»</span>
                      <span className="text-slate-700 font-bold">Overtime Policy</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert("Overtime Policy updated successfully!")}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      Update Details
                    </button>
                  </div>

                  {/* Overtime Form Content */}
                  <div className="max-w-md mx-auto space-y-6 pt-2 text-xs">
                    {/* Section 1: Working Days */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-xs">Working Days</h4>

                      {/* Overtime considered after */}
                      <div className="space-y-1.5">
                        <label className="block text-slate-600 font-medium text-xs">
                          Overtime considered after <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={overtimeConsideredAfterMins}
                            onChange={(e) => setOvertimeConsideredAfterMins(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full px-3 py-2 pr-12 rounded-md border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                            mins
                          </span>
                        </div>
                      </div>

                      {/* Extra Hours Pay & Amount */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Extra Hours Pay <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={extraHoursPayType}
                              onChange={(e) => setExtraHoursPayType(e.target.value)}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                            >
                              <option>Fixed Hourly Rate</option>
                              <option>1.5x Hourly Rate</option>
                              <option>2x Hourly Rate</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={extraHoursPayAmount}
                              onChange={(e) => setExtraHoursPayAmount(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full pl-6 pr-12 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              /hour
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Weekoffs and Holidays */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-bold text-slate-800 text-xs">Weekoffs and Holidays</h4>

                      {/* Public Holiday Pay & Amount */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Public Holiday Pay <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={publicHolidayPayType}
                              onChange={(e) => setPublicHolidayPayType(e.target.value)}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                            >
                              <option>Fixed Daily Rate</option>
                              <option>2x Daily Rate</option>
                              <option>1.5x Daily Rate</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={publicHolidayPayAmount}
                              onChange={(e) => setPublicHolidayPayAmount(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full pl-6 pr-12 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              /day
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Week Off Pay & Amount */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Week Off Pay <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={weekOffPayType}
                              onChange={(e) => setWeekOffPayType(e.target.value)}
                              className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                            >
                              <option>Fixed Daily Rate</option>
                              <option>2x Daily Rate</option>
                              <option>1.5x Daily Rate</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-slate-600 font-medium text-xs">
                            Amount <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              ₹
                            </span>
                            <input
                              type="text"
                              value={weekOffPayAmount}
                              onChange={(e) => setWeekOffPayAmount(e.target.value.replace(/[^0-9]/g, ""))}
                              className="w-full pl-6 pr-12 py-2 rounded-md border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                              /day
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== "Personal Details" &&
            activeTab !== "Employment Details" &&
            activeTab !== "Custom Details" &&
            activeTab !== "Background Verification" &&
            activeTab !== "Bank Account" &&
            activeTab !== "Approval Flows" &&
            activeTab !== "User Permission" &&
            activeTab !== "Attendance Details" &&
            activeTab !== "Salary Details" &&
            activeTab !== "Penalty & Overtime Details" &&
            activeTab !== "Documents" &&
            activeTab !== "Additional Settings" && (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{activeTab}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Configure and manage {activeTab.toLowerCase()} for {formData.name}.
                </p>
                <button
                  onClick={() => alert(`Saving ${activeTab} preferences...`)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md transition-colors"
                >
                  Configure {activeTab}
                </button>
              </div>
            )}
        </div>
      </div>

      {/* MODAL 1: Past Employment Details */}
      {isPastEmploymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                Past Employment Details
              </h3>
              <button
                onClick={() => setIsPastEmploymentModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPastEmployment} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newPastEmployment.companyName}
                  onChange={(e) =>
                    setNewPastEmployment({
                      ...newPastEmployment,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="Previous company name"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={newPastEmployment.designation}
                  onChange={(e) =>
                    setNewPastEmployment({
                      ...newPastEmployment,
                      designation: e.target.value,
                    })
                  }
                  placeholder="e.g. Junior Technician"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newPastEmployment.joiningDate}
                    onChange={(e) =>
                      setNewPastEmployment({
                        ...newPastEmployment,
                        joiningDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Leaving Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newPastEmployment.leavingDate}
                    onChange={(e) =>
                      setNewPastEmployment({
                        ...newPastEmployment,
                        leavingDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Currency
                  </label>
                  <select
                    value={newPastEmployment.currency}
                    onChange={(e) =>
                      setNewPastEmployment({
                        ...newPastEmployment,
                        currency: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={newPastEmployment.salary}
                    onChange={(e) =>
                      setNewPastEmployment({
                        ...newPastEmployment,
                        salary: e.target.value,
                      })
                    }
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Company GST
                </label>
                <input
                  type="text"
                  value={newPastEmployment.companyGst}
                  onChange={(e) =>
                    setNewPastEmployment({
                      ...newPastEmployment,
                      companyGst: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="GSTIN number"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPastEmploymentModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Custom Field Modal */}
      {isCustomFieldModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Add Custom Field</h3>
              <button
                onClick={() => setIsCustomFieldModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomField} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Field Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCustomField.fieldName}
                  onChange={(e) =>
                    setNewCustomField({
                      ...newCustomField,
                      fieldName: e.target.value,
                    })
                  }
                  placeholder="e.g. Laptop Serial No, Uniform Size"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Field Value
                </label>
                <input
                  type="text"
                  value={newCustomField.fieldValue}
                  onChange={(e) =>
                    setNewCustomField({
                      ...newCustomField,
                      fieldValue: e.target.value,
                    })
                  }
                  placeholder="e.g. DELL-98214"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomFieldModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Save Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Bank / UPI Details */}
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                Bank / UPI Details
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-6 pb-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="bankOption"
                    checked={bankType === "bank"}
                    onChange={() => setBankType("bank")}
                    className="w-4 h-4 text-[#007BFF] focus:ring-blue-500"
                  />
                  <span>Bank Account</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="bankOption"
                    checked={bankType === "upi"}
                    onChange={() => setBankType("upi")}
                    className="w-4 h-4 text-[#007BFF] focus:ring-blue-500"
                  />
                  <span>UPI</span>
                </label>
              </div>

              {bankType === "bank" ? (
                <>
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Account Holder's name:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        value={bankFormData.accountHolder}
                        onChange={(e) =>
                          setBankFormData({
                            ...bankFormData,
                            accountHolder: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Account Number:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        value={bankFormData.accountNumber}
                        onChange={(e) =>
                          setBankFormData({
                            ...bankFormData,
                            accountNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> Bank Name:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        value={bankFormData.bankName}
                        onChange={(e) =>
                          setBankFormData({
                            ...bankFormData,
                            bankName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="text-slate-600 font-medium">
                      <span className="text-red-500">*</span> IFSC Code:
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        required
                        value={bankFormData.ifscCode}
                        onChange={(e) =>
                          setBankFormData({
                            ...bankFormData,
                            ifscCode: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-3 items-center gap-2">
                  <label className="text-slate-600 font-medium">
                    <span className="text-red-500">*</span> UPI ID:
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9052306037@okhdfcbank"
                      value={bankFormData.upiId}
                      onChange={(e) =>
                        setBankFormData({ ...bankFormData, upiId: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add New Approval Flow Modal (Screenshots 3, 4, 5 Match 1:1) */}
      {isAddApprovalFlowModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <h3 className="font-bold text-slate-800 text-sm">
                Add New Approval Flow
              </h3>
              <button
                type="button"
                onClick={() => setIsAddApprovalFlowModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveApprovalFlow}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    <span className="text-red-500">*</span> Flow Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    placeholder="e.g. Standard 2-level flow"
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <label className="text-slate-800 font-bold text-xs">
                      Approval Levels
                    </label>
                    <div className="w-5 h-5 rounded-full border border-blue-400 text-[#007BFF] flex items-center justify-center font-bold text-[10px]">
                      1
                    </div>
                  </div>

                  <div className="space-y-3">
                    {flowLevels.map((lvl, index) => (
                      <div
                        key={index}
                        className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-[10px]">
                              {index + 1}
                            </div>
                            <span className="font-bold text-slate-800 text-xs">
                              Level {index + 1}
                            </span>
                          </div>

                          {flowLevels.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFlowLevels(flowLevels.filter((_, i) => i !== index))
                              }
                              className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Approvers Dropdown (Screenshot 3 & 4 Match) */}
                        <div className="space-y-1 relative">
                          <label className="block text-slate-600 font-medium text-[11px]">
                            <span className="text-red-500">*</span> Approvers
                          </label>
                          <div
                            onClick={() => {
                              const updated = [...flowLevels];
                              updated[index].isDropdownOpen = !updated[index].isDropdownOpen;
                              setFlowLevels(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white flex items-center justify-between cursor-pointer focus:ring-1 focus:ring-blue-500"
                          >
                            <span className="text-slate-800 font-medium">
                              {lvl.approver || "Select role or employee"}
                            </span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </div>

                          {lvl.isDropdownOpen && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => {
                                  const updated = [...flowLevels];
                                  updated[index].isDropdownOpen = false;
                                  setFlowLevels(updated);
                                }}
                              />
                              <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-xl border border-slate-200 z-40 py-1 max-h-48 overflow-y-auto text-xs">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                                  Admins
                                </div>
                                <div
                                  onClick={() => {
                                    const updated = [...flowLevels];
                                    updated[index].approver = "All Admins";
                                    updated[index].isDropdownOpen = false;
                                    setFlowLevels(updated);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                >
                                  All Admins
                                </div>
                                <div
                                  onClick={() => {
                                    const updated = [...flowLevels];
                                    updated[index].approver = "PAPPU SRINIVASA PRABHAKAR RAO";
                                    updated[index].isDropdownOpen = false;
                                    setFlowLevels(updated);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                >
                                  PAPPU SRINIVASA PRABHAKAR RAO
                                </div>

                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-t border-slate-100">
                                  Branch Admins
                                </div>
                                <div
                                  onClick={() => {
                                    const updated = [...flowLevels];
                                    updated[index].approver = "All Branch Admins";
                                    updated[index].isDropdownOpen = false;
                                    setFlowLevels(updated);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                >
                                  All Branch Admins
                                </div>

                                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-t border-slate-100">
                                  Advanced Attendance Manager
                                </div>
                                <div
                                  onClick={() => {
                                    const updated = [...flowLevels];
                                    updated[index].approver = "All Advanced Attendance Managers";
                                    updated[index].isDropdownOpen = false;
                                    setFlowLevels(updated);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                >
                                  All Advanced Attendance Managers
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* If nobody acts Dropdown (Screenshot 5 Match) */}
                        <div className="space-y-1">
                          <label className="block text-slate-600 font-medium text-[11px]">
                            If nobody acts
                          </label>
                          <select
                            value={lvl.policy}
                            onChange={(e) => {
                              const updated = [...flowLevels];
                              updated[index].policy = e.target.value;
                              setFlowLevels(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-800 cursor-pointer"
                          >
                            <option>Wait for approval</option>
                            <option>Auto-approve</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddApprovalLevel}
                    className="mt-2 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Level</span>
                  </button>
                </div>

                {/* Amount Threshold Checkbox (Screenshot 1 & 2 Match) */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAmountThreshold}
                      onChange={(e) => setUseAmountThreshold(e.target.checked)}
                      className="rounded border-slate-300 text-[#007BFF] focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Use different approval levels when the request amount exceeds</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5000"
                    value={thresholdAmount}
                    onChange={(e) => setThresholdAmount(e.target.value)}
                    className="w-28 px-3 py-1.5 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                {/* Conditional Card: Above ₹— (Screenshot 2 Match) */}
                {useAmountThreshold && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          Above ₹{thresholdAmount || "—"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Requests above this amount route here instead
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-blue-400 text-[#007BFF] flex items-center justify-center font-bold text-[10px]">
                        2
                      </div>
                    </div>

                    <div className="space-y-3">
                      {thresholdLevels.map((lvl, index) => (
                        <div
                          key={index}
                          className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#007BFF] text-white flex items-center justify-center font-bold text-[10px]">
                                {index + 1}
                              </div>
                              <span className="font-bold text-slate-800 text-xs">
                                Level {index + 1}
                              </span>
                            </div>

                            {thresholdLevels.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setThresholdLevels(
                                    thresholdLevels.filter((_, i) => i !== index)
                                  )
                                }
                                className="text-slate-400 hover:text-red-500 text-xs cursor-pointer"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="space-y-1 relative">
                            <label className="block text-slate-600 font-medium text-[11px]">
                              <span className="text-red-500">*</span> Approvers
                            </label>
                            <div
                              onClick={() => {
                                const updated = [...thresholdLevels];
                                updated[index].isDropdownOpen = !updated[index].isDropdownOpen;
                                setThresholdLevels(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white flex items-center justify-between cursor-pointer focus:ring-1 focus:ring-blue-500"
                            >
                              <span className="text-slate-800 font-medium">
                                {lvl.approver || "Select role or employee"}
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </div>

                            {lvl.isDropdownOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => {
                                    const updated = [...thresholdLevels];
                                    updated[index].isDropdownOpen = false;
                                    setThresholdLevels(updated);
                                  }}
                                />
                                <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-md shadow-xl border border-slate-200 z-40 py-1 max-h-48 overflow-y-auto text-xs">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                                    Admins
                                  </div>
                                  <div
                                    onClick={() => {
                                      const updated = [...thresholdLevels];
                                      updated[index].approver = "All Admins";
                                      updated[index].isDropdownOpen = false;
                                      setThresholdLevels(updated);
                                    }}
                                    className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                  >
                                    All Admins
                                  </div>
                                  <div
                                    onClick={() => {
                                      const updated = [...thresholdLevels];
                                      updated[index].approver =
                                        "PAPPU SRINIVASA PRABHAKAR RAO";
                                      updated[index].isDropdownOpen = false;
                                      setThresholdLevels(updated);
                                    }}
                                    className="px-4 py-2 hover:bg-blue-50 hover:text-[#007BFF] cursor-pointer"
                                  >
                                    PAPPU SRINIVASA PRABHAKAR RAO
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="block text-slate-600 font-medium text-[11px]">
                              If nobody acts
                            </label>
                            <select
                              value={lvl.policy}
                              onChange={(e) => {
                                const updated = [...thresholdLevels];
                                updated[index].policy = e.target.value;
                                setThresholdLevels(updated);
                              }}
                              className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-800 cursor-pointer"
                            >
                              <option>Wait for approval</option>
                              <option>Auto-approve</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setThresholdLevels([
                          ...thresholdLevels,
                          {
                            approver: "All Admins",
                            policy: "Wait for approval",
                          },
                        ])
                      }
                      className="mt-2 text-xs font-semibold text-[#007BFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Level</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddApprovalFlowModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-md cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Add Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Leave without saving changes? Confirmation (Screenshot Match 1:1) */}
      {isUnsavedModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-800 text-sm">
              Leave without saving changes?
            </h3>
            <p className="text-slate-600 leading-relaxed text-xs">
              You have unsaved changes on this page. Do you want to switch?
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsUnsavedModalOpen(false);
                  setPendingNavTab(null);
                }}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
              >
                Stay on this page
              </button>
              <button
                type="button"
                onClick={handleConfirmLeavePage}
                className="px-5 py-2 rounded-md bg-[#007BFF] hover:bg-blue-600 text-white font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Leave Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
