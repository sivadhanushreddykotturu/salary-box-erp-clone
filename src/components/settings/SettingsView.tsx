"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Info,
  Building2,
  GitBranch,
  FolderTree,
  FileSpreadsheet,
  Users,
  UserCheck,
  FormInput,
  UserX,
  CreditCard,
  Clock,
  Coffee,
  ScanFace,
  QrCode,
  Tablet,
  Fingerprint,
  MapPin,
  ShieldCheck,
  Eye,
  Crosshair,
  CalendarDays,
  GitPullRequest,
  Calendar,
  Navigation,
  FileCheck2,
  Percent,
  Layers,
  FileText,
  Calculator,
  Receipt,
  Bell,
  Key,
  HelpCircle,
  MessageSquarePlus,
  LogOut,
  X,
  Check,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";

export function SettingsView() {
  const router = useRouter();

  // Loading & sync state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Company Details State
  const [companyDetails, setCompanyDetails] = useState<{
    name: string;
    companyCode: string;
    businessEmail: string;
    phone: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    logo?: string | null;
    businessType?: string | null;
    udyamNumber?: string | null;
    branchesCount: number;
    departmentsCount: number;
    employeesCount: number;
  }>({
    name: "RSS LOGISTICS",
    companyCode: "IDGWDA",
    businessEmail: "admin@rsslogistics.in",
    phone: "+91 98765 43210",
    gstin: "37AAAAA0000A1Z5",
    address: "Auto Nagar, Industrial Estate",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: "520007",
    logo: null,
    businessType: "",
    udyamNumber: "",
    branchesCount: 3,
    departmentsCount: 5,
    employeesCount: 42,
  });

  // Settings State matching SalaryBox
  const [settings, setSettings] = useState({
    // Attendance Settings
    attendanceSettings: {
      aiFaceRecognition: true,
      deviceVerification: true,
      livenessDetection: false,
      blockFakeGps: true,
      autoLiveTrack: false,
      gpsRadiusMeters: 100,
    },
    // Salary Settings
    salarySettings: {
      calculationType: "CALENDAR_MONTH" as "CALENDAR_MONTH" | "30_DAYS" | "26_DAYS",
      includeWeekoffs: false,
      includeHolidays: false,
      cycleStartDate: 1,
      cycleEndDate: "End of Month",
      roundOffTotalSalary: false,
      autoCalculateTds: true,
    },
    // Alert & Notifications
    alertSettings: {
      appNotifications: true,
    },
    // Other Settings
    otherSettings: {
      supportTicketVisibility: true,
    },
  });

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | null
    | "editCompany"
    | "branches"
    | "departments"
    | "shifts"
    | "breaks"
    | "customPaidLeaves"
    | "holidayList"
    | "customFields"
    | "apiKeys"
    | "requestFeature"
    | "geofenceInfo"
  >(null);

  // Sub-items mock / live state for modals
  const [branchesList, setBranchesList] = useState([
    { id: "1", name: "Main Office (Vijayawada)", code: "VJA-01", address: "Auto Nagar, Industrial Area", radius: 100 },
    { id: "2", name: "Hyderabad Hub", code: "HYD-01", address: "Madhapur, Hitech City", radius: 150 },
    { id: "3", name: "Guntur Warehouse", code: "GNT-01", address: "Guntur By-Pass Road", radius: 200 },
  ]);

  const [departmentsList, setDepartmentsList] = useState([
    { id: "1", name: "Management" },
    { id: "2", name: "Operations" },
    { id: "3", name: "Field Logistics" },
    { id: "4", name: "Accounts & Finance" },
    { id: "5", name: "HR & Administration" },
  ]);

  const [shiftsList, setShiftsList] = useState([
    { id: "1", name: "General Shift", startTime: "09:00 AM", endTime: "06:00 PM", grace: 15 },
    { id: "2", name: "Morning Logistics", startTime: "06:00 AM", endTime: "02:30 PM", grace: 10 },
    { id: "3", name: "Night Warehouse", startTime: "09:00 PM", endTime: "05:30 AM", grace: 15 },
  ]);

  const [breaksList, setBreaksList] = useState([
    { id: "1", name: "Lunch Break", duration: "45 mins", isPaid: true },
    { id: "2", name: "Tea Break (Evening)", duration: "15 mins", isPaid: true },
  ]);

  const [leavesList, setLeavesList] = useState([
    { id: "1", name: "Casual Leave (CL)", daysPerYear: 12, isPaid: true },
    { id: "2", name: "Sick Leave (SL)", daysPerYear: 10, isPaid: true },
    { id: "3", name: "Earned Leave (EL)", daysPerYear: 15, isPaid: true },
  ]);

  const [holidaysList, setHolidaysList] = useState([
    { id: "1", name: "Republic Day", date: "26 Jan 2026", isMandatory: true },
    { id: "2", name: "Independence Day", date: "15 Aug 2026", isMandatory: true },
    { id: "3", name: "Gandhi Jayanti", date: "02 Oct 2026", isMandatory: true },
    { id: "4", name: "Diwali", date: "08 Nov 2026", isMandatory: true },
  ]);

  const [apiKeysList, setApiKeysList] = useState([
    { id: "1", name: "Production ERP Integration", key: "sb_live_98a7sd6f7a6sdf98a7sdf68a7sd", createdAt: "12 Jan 2026" },
  ]);

  // Temporary edit states
  const [newBranch, setNewBranch] = useState({ name: "", code: "", address: "", radius: 100 });
  const [newDept, setNewDept] = useState("");
  const [newShift, setNewShift] = useState({ name: "", startTime: "09:00", endTime: "18:00", grace: 15 });
  const [newBreak, setNewBreak] = useState({ name: "", duration: "30 mins", isPaid: true });
  const [newLeave, setNewLeave] = useState({ name: "", daysPerYear: 12, isPaid: true });
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });
  const [featureFeedback, setFeatureFeedback] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Initial Settings from Database
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/v1/settings");
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            if (json.data.company) {
              setCompanyDetails((prev) => ({ ...prev, ...json.data.company }));
            }
            if (json.data.settings) {
              setSettings((prev) => ({
                ...prev,
                attendanceSettings: {
                  ...prev.attendanceSettings,
                  ...json.data.settings.attendanceSettings,
                },
                salarySettings: {
                  ...prev.salarySettings,
                  ...json.data.settings.salarySettings,
                },
                alertSettings: {
                  ...prev.alertSettings,
                  ...json.data.settings.alertSettings,
                },
                otherSettings: {
                  ...prev.otherSettings,
                  ...json.data.settings.otherSettings,
                },
              }));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Sync settings updates directly to MongoDB
  const persistSettings = async (
    updatedSettings: typeof settings,
    updatedCompany?: Partial<typeof companyDetails>
  ) => {
    setSaving(true);
    try {
      const res = await fetch("/api/v1/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: updatedSettings,
          companyDetails: updatedCompany,
        }),
      });
      if (res.ok) {
        showToast("Settings updated in database successfully");
      }
    } catch (err) {
      showToast("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Handlers
  const handleAttendanceToggle = (key: keyof typeof settings.attendanceSettings) => {
    const next = {
      ...settings,
      attendanceSettings: {
        ...settings.attendanceSettings,
        [key]: !settings.attendanceSettings[key],
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleSalaryToggle = (key: keyof typeof settings.salarySettings) => {
    const next = {
      ...settings,
      salarySettings: {
        ...settings.salarySettings,
        [key]: !settings.salarySettings[key],
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleAlertToggle = (key: keyof typeof settings.alertSettings) => {
    const next = {
      ...settings,
      alertSettings: {
        ...settings.alertSettings,
        [key]: !settings.alertSettings[key],
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleOtherToggle = (key: keyof typeof settings.otherSettings) => {
    const next = {
      ...settings,
      otherSettings: {
        ...settings.otherSettings,
        [key]: !settings.otherSettings[key],
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleCalculationTypeChange = (type: "CALENDAR_MONTH" | "30_DAYS" | "26_DAYS") => {
    const next = {
      ...settings,
      salarySettings: {
        ...settings.salarySettings,
        calculationType: type,
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleCycleStartDateChange = (day: number) => {
    const next = {
      ...settings,
      salarySettings: {
        ...settings.salarySettings,
        cycleStartDate: day,
      },
    };
    setSettings(next);
    persistSettings(next);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {
      // ignore
    }
    window.location.href = "/login";
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-md hover:bg-slate-200/60 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm md:text-base font-bold text-slate-900">Settings</h1>
        </div>

        {saving && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving changes...</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* ========================================================= */}
        {/* 1. COMPANY DETAILS */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Company Details
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Edit Company Details */}
            <div
              onClick={() => router.push("/add-edit-company")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                {companyDetails.logo ? (
                  <img
                    src={companyDetails.logo}
                    alt={companyDetails.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                    RSS
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {companyDetails.name}
                  </div>
                  <div className="text-[11px] text-slate-500">Edit company details</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* My Branches */}
            <div
              onClick={() => router.push("/branches")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    My Branches
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add or remove branches ({branchesList.length} active)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* My Departments */}
            <div
              onClick={() => router.push("/departments")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    My Departments
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add or remove departments ({departmentsList.length} active)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* My Company Report */}
            <Link
              href="/company-reports"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    My Company Report
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Generate different types of report for whole company
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. MY TEAM */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              My Team
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Admins */}
            <Link
              href="/my-team"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Admins
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add more Admins to your company
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Employees & Managers */}
            <Link
              href="/my-team"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Employees & Managers
                  </div>
                  <div className="text-[11px] text-slate-500">Manage your staff</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Custom Fields */}
            <div
              onClick={() => setActiveModal("customFields")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FormInput className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Custom Fields
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Create custom staff information fields
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Inactive Employees */}
            <Link
              href="/my-team"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Inactive Employees
                  </div>
                  <div className="text-[11px] text-slate-500">Manage inactive employees</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Auto Generate Employee ID */}
            <div
              onClick={() => showToast("Employee ID auto-generation is active (Prefix: EMP-)")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Auto Generate Employee ID
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Set up auto-generation of employee IDs
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. ATTENDANCE SETTINGS */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Attendance Settings
            </h2>
          </div>

          {/* Subheading: Shifts And Breaks */}
          <div className="px-5 py-2 bg-slate-50/30 border-b border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Shifts And Breaks
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Shifts */}
            <div
              onClick={() => setActiveModal("shifts")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Shifts
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add or remove company shifts ({shiftsList.length} configured)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Breaks */}
            <div
              onClick={() => setActiveModal("breaks")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Breaks
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add or remove company breaks ({breaksList.length} configured)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Subheading: Attendance Modes */}
          <div className="px-5 py-2 bg-slate-50/30 border-b border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Modes
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* AI Face Recognition */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <ScanFace className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    AI Face Recognition
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Verify Staff face on Punch In and Punch Out
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAttendanceToggle("aiFaceRecognition")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceSettings.aiFaceRecognition ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceSettings.aiFaceRecognition ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* QR Codes */}
            <div
              onClick={() => showToast("QR Code attendance configured for office gates")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      QR Codes
                    </span>
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      New
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Attendance via QR Code</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Attendance Kiosk */}
            <div
              onClick={() => showToast("Attendance Kiosk tablet mode active")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Tablet className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Attendance Kiosk
                    </span>
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      New
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add attendance kiosk and manage employees
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Biometric */}
            <div
              onClick={() => showToast("Biometric machine integration active")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Biometric
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add biometric device and manage employees
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Subheading: Fraud Prevention & Secure Attendance */}
          <div className="px-5 py-2 bg-slate-50/30 border-b border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Fraud Prevention & Secure Attendance
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* GPS Based Geofence */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    GPS Based Geofence
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Only allow attendance from inside a set radius of your office.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveModal("geofenceInfo")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Learn More
              </button>
            </div>

            {/* Device Verification */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Device Verification
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Staff can only punch in from an approved device. Any new device needs to be approved by admin first.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAttendanceToggle("deviceVerification")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceSettings.deviceVerification ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceSettings.deviceVerification ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Liveness Detection */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Liveness Detection
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Verifies that a real person is present in front of the camera - prevents fake attendance using photos or pre-recorded videos.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAttendanceToggle("livenessDetection")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceSettings.livenessDetection ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceSettings.livenessDetection ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Block Fake GPS Attendance */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Crosshair className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Block Fake GPS Attendance
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Staff won't be able to mark attendance via fake GPS apps
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAttendanceToggle("blockFakeGps")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceSettings.blockFakeGps ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceSettings.blockFakeGps ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Subheading: Leaves And Holidays */}
          <div className="px-5 py-2 bg-slate-50/30 border-b border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Leaves And Holidays
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Custom Paid Leaves */}
            <div
              onClick={() => setActiveModal("customPaidLeaves")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Custom Paid Leaves
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Create custom company leaves ({leavesList.length} defined)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Leave Approval Flow */}
            <div
              onClick={() => showToast("Leave Approval Flow: Admin -> Reporting Manager")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Leave Approval Flow
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Create a multi-level leave approval flow.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Holiday List */}
            <div
              onClick={() => setActiveModal("holidayList")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Holiday List
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Add or remove public holidays for your company ({holidaysList.length} holidays)
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          {/* Subheading: Automation */}
          <div className="px-5 py-2 bg-slate-50/30 border-b border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Automation
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Auto Live Track */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Auto Live Track
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Track employees live location
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAttendanceToggle("autoLiveTrack")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.attendanceSettings.autoLiveTrack ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.attendanceSettings.autoLiveTrack ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. SALARY SETTINGS */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Salary Settings
            </h2>
          </div>

          <div className="p-5 space-y-4">
            {/* Calendar Month Option */}
            <div className="space-y-2.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  checked={settings.salarySettings.calculationType === "CALENDAR_MONTH"}
                  onChange={() => handleCalculationTypeChange("CALENDAR_MONTH")}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Calendar Month</div>
                  <div className="text-[11px] text-slate-500">
                    eg. Jan - 31 days Feb - 28 days
                  </div>
                </div>
              </label>

              {/* Sub-toggles when Calendar Month is selected */}
              {settings.salarySettings.calculationType === "CALENDAR_MONTH" && (
                <div className="ml-7 pl-3 border-l-2 border-blue-100 space-y-2 py-1">
                  <div className="flex items-center justify-between py-1 max-w-md">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <span>Include Weekoffs</span>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSalaryToggle("includeWeekoffs")}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.salarySettings.includeWeekoffs ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          settings.salarySettings.includeWeekoffs ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-1 max-w-md">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <span>Include Holidays</span>
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSalaryToggle("includeHolidays")}
                      className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        settings.salarySettings.includeHolidays ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          settings.salarySettings.includeHolidays ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 30 Day Month Option */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  checked={settings.salarySettings.calculationType === "30_DAYS"}
                  onChange={() => handleCalculationTypeChange("30_DAYS")}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">30 Day Month</div>
                  <div className="text-[11px] text-slate-500">
                    eg. Jan - 30 days Feb - 30 days
                  </div>
                </div>
              </label>
            </div>

            {/* 26 Day Month Option */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="calculationType"
                  checked={settings.salarySettings.calculationType === "26_DAYS"}
                  onChange={() => handleCalculationTypeChange("26_DAYS")}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">26 Day Month</div>
                  <div className="text-[11px] text-slate-500">
                    eg. Jan - 26 days Feb - 26 days
                  </div>
                </div>
              </label>
            </div>

            {/* Attendance Cycle */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                <span>Attendance Cycle</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={settings.salarySettings.cycleStartDate}
                    onChange={(e) => handleCycleStartDateChange(Number(e.target.value))}
                    className="appearance-none bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 pr-8 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-2.5 text-[10px] text-slate-500">
                    ▼
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">to</span>
                <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200">
                  End of Month
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                Start Date
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {/* Salary Details Import Settings */}
            <div
              onClick={() => showToast("Salary import column mappings configured")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Salary Details Import Settings
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Configure Settings for Salary Data Import
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Incentive Types */}
            <div
              onClick={() => showToast("Incentive types active: Commission, Performance, Festival")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Incentive Types
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Configure Incentive Types
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Create Salary Template */}
            <Link
              href="/payroll"
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Create Salary Template
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Define templates for splitting Employee CTC into different earning heads
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Customize Pay Slips */}
            <div
              onClick={() => showToast("Payslip template: SalaryBox Official with CTC breakup")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Customize Pay Slips
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Customize your payslips by choosing what components you want to include
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Round Off Total Salary */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Round Off Total Salary
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Round off total salary to the nearest decimal
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSalaryToggle("roundOffTotalSalary")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.salarySettings.roundOffTotalSalary ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.salarySettings.roundOffTotalSalary ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Auto-Calculate TDS */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Auto-Calculate TDS
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Calculate TDS on salary based on the declared TDS details of employees
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSalaryToggle("autoCalculateTds")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.salarySettings.autoCalculateTds ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.salarySettings.autoCalculateTds ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Reimbursement Approval Flow */}
            <div
              onClick={() => showToast("Reimbursement Approval: Manager -> Finance Admin")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <GitPullRequest className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Reimbursement Approval Flow
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Create a multi-level reimbursement approval flow.
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. ALERT & NOTIFICATION */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Alert & Notification
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {/* App Notifications */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    App Notifications
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Get important alerts on App
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAlertToggle("appNotifications")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.alertSettings.appNotifications ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.alertSettings.appNotifications ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. OTHER SETTINGS */}
        {/* ========================================================= */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Other Settings
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {/* API Keys */}
            <div
              onClick={() => setActiveModal("apiKeys")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    API Keys
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Create and manage API keys for integrating with SalaryBox
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Support Ticket Visibility */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Support Ticket Visibility
                  </div>
                  <div className="text-[11px] text-slate-500">
                    When turned on, users can see all the tickets raised for the company. When turned off, they can only see the tickets raised by themselves.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOtherToggle("supportTicketVisibility")}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.otherSettings.supportTicketVisibility ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    settings.otherSettings.supportTicketVisibility ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Request A Feature */}
            <div
              onClick={() => setActiveModal("requestFeature")}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Request A Feature
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Give your valuable feedback and feature request
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-red-50/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600">Logout</div>
                  <div className="text-[11px] text-slate-500">Logout from device</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* 1. Edit Company Modal */}
      {activeModal === "editCompany" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Edit Company Details</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Code</label>
                  <input
                    type="text"
                    disabled
                    value={companyDetails.companyCode}
                    className="w-full text-xs px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={companyDetails.gstin}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, gstin: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={companyDetails.businessEmail}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, businessEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={companyDetails.phone}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Address</label>
                <input
                  type="text"
                  value={companyDetails.address}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={companyDetails.city}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={companyDetails.state}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={companyDetails.pincode}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, pincode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  persistSettings(settings, companyDetails);
                  setActiveModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. My Branches Modal */}
      {activeModal === "branches" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Manage Branches</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {branchesList.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{branch.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Code: {branch.code} • Geofence: {branch.radius}m • {branch.address}
                      </div>
                    </div>
                    <button
                      onClick={() => setBranchesList(branchesList.filter((b) => b.id !== branch.id))}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Branch */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-800">Add New Branch</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Branch Name (e.g. Vizag Office)"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Branch Code (e.g. VZG-01)"
                    value={newBranch.code}
                    onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                    className="text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={newBranch.address}
                  onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newBranch.name) return;
                    setBranchesList([
                      ...branchesList,
                      { id: Date.now().toString(), ...newBranch },
                    ]);
                    setNewBranch({ name: "", code: "", address: "", radius: 100 });
                    showToast("Branch added successfully");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Branch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. My Departments Modal */}
      {activeModal === "departments" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Manage Departments</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {departmentsList.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-900">{dept.name}</span>
                    <button
                      onClick={() => setDepartmentsList(departmentsList.filter((d) => d.id !== dept.id))}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newDept.trim()) return;
                    setDepartmentsList([
                      ...departmentsList,
                      { id: Date.now().toString(), name: newDept.trim() },
                    ]);
                    setNewDept("");
                    showToast("Department added successfully");
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Shifts Modal */}
      {activeModal === "shifts" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Manage Shifts</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {shiftsList.map((shift) => (
                  <div
                    key={shift.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{shift.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {shift.startTime} – {shift.endTime} (Grace: {shift.grace} mins)
                      </div>
                    </div>
                    <button
                      onClick={() => setShiftsList(shiftsList.filter((s) => s.id !== shift.id))}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Shift */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-800">Add New Shift</div>
                <input
                  type="text"
                  placeholder="Shift Name (e.g. Evening Shift)"
                  value={newShift.name}
                  onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Start Time</label>
                    <input
                      type="time"
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">End Time</label>
                    <input
                      type="time"
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                      className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Grace (mins)</label>
                    <input
                      type="number"
                      value={newShift.grace}
                      onChange={(e) => setNewShift({ ...newShift, grace: Number(e.target.value) })}
                      className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded-md bg-white"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newShift.name) return;
                    setShiftsList([
                      ...shiftsList,
                      {
                        id: Date.now().toString(),
                        name: newShift.name,
                        startTime: newShift.startTime,
                        endTime: newShift.endTime,
                        grace: newShift.grace,
                      },
                    ]);
                    setNewShift({ name: "", startTime: "09:00", endTime: "18:00", grace: 15 });
                    showToast("Shift created successfully");
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Shift</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Breaks Modal */}
      {activeModal === "breaks" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Company Breaks</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {breaksList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">
                        Duration: {item.duration} • {item.isPaid ? "Paid Break" : "Unpaid Break"}
                      </div>
                    </div>
                    <button
                      onClick={() => setBreaksList(breaksList.filter((b) => b.id !== item.id))}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="Break Name (e.g. Afternoon Tea)"
                  value={newBreak.name}
                  onChange={(e) => setNewBreak({ ...newBreak, name: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 20 mins)"
                  value={newBreak.duration}
                  onChange={(e) => setNewBreak({ ...newBreak, duration: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newBreak.name) return;
                    setBreaksList([
                      ...breaksList,
                      { id: Date.now().toString(), ...newBreak },
                    ]);
                    setNewBreak({ name: "", duration: "30 mins", isPaid: true });
                    showToast("Break added successfully");
                  }}
                  className="w-full py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Break
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Custom Paid Leaves Modal */}
      {activeModal === "customPaidLeaves" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Custom Paid Leaves</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {leavesList.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{leave.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {leave.daysPerYear} days / year • {leave.isPaid ? "Paid" : "Unpaid"}
                      </div>
                    </div>
                    <button
                      onClick={() => setLeavesList(leavesList.filter((l) => l.id !== leave.id))}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="Leave Name (e.g. Maternity Leave)"
                  value={newLeave.name}
                  onChange={(e) => setNewLeave({ ...newLeave, name: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <input
                  type="number"
                  placeholder="Days per year"
                  value={newLeave.daysPerYear}
                  onChange={(e) => setNewLeave({ ...newLeave, daysPerYear: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newLeave.name) return;
                    setLeavesList([
                      ...leavesList,
                      { id: Date.now().toString(), ...newLeave },
                    ]);
                    setNewLeave({ name: "", daysPerYear: 12, isPaid: true });
                    showToast("Leave type added successfully");
                  }}
                  className="w-full py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Leave Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Holiday List Modal */}
      {activeModal === "holidayList" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Public Holiday List</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                {holidaysList.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{holiday.name}</div>
                      <div className="text-[11px] text-slate-500">{holiday.date}</div>
                    </div>
                    <button
                      onClick={() => setHolidaysList(holidaysList.filter((h) => h.id !== holiday.id))}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder="Holiday Name (e.g. Pongal / Sankranti)"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <input
                  type="text"
                  placeholder="Date (e.g. 15 Jan 2026)"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newHoliday.name || !newHoliday.date) return;
                    setHolidaysList([
                      ...holidaysList,
                      { id: Date.now().toString(), name: newHoliday.name, date: newHoliday.date, isMandatory: true },
                    ]);
                    setNewHoliday({ name: "", date: "" });
                    showToast("Holiday added successfully");
                  }}
                  className="w-full py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Add Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. API Keys Modal */}
      {activeModal === "apiKeys" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">SalaryBox API Keys</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                Use these API keys to connect SalaryBox with your external ERP, payroll software, or attendance biometric hardware.
              </p>

              <div className="space-y-2">
                {apiKeysList.map((item) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="font-mono text-[11px] text-slate-600 bg-white p-1.5 border border-slate-200 rounded mt-1 select-all">
                      {item.key}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const generated = `sb_live_${Math.random().toString(36).substring(2)}${Date.now()}`;
                  setApiKeysList([
                    ...apiKeysList,
                    { id: Date.now().toString(), name: `API Key #${apiKeysList.length + 1}`, key: generated, createdAt: "Just now" },
                  ]);
                  showToast("New API Key generated successfully");
                }}
                className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Generate New Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Request A Feature Modal */}
      {activeModal === "requestFeature" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Request A Feature / Feedback</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600">
                Tell us what features or workflow improvements you would love to see in SalaryBox.
              </p>
              <textarea
                rows={4}
                value={featureFeedback}
                onChange={(e) => setFeatureFeedback(e.target.value)}
                placeholder="Describe your feature request or feedback in detail..."
                className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (!featureFeedback.trim()) return;
                  showToast("Thank you! Your feedback has been sent to our product team.");
                  setFeatureFeedback("");
                  setActiveModal(null);
                }}
                className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Geofence Info Modal */}
      {activeModal === "geofenceInfo" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">GPS Based Geofence</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-600">
              <p>
                Geofencing restricts mobile punch-in to within a specified radius (e.g. 100 meters) of your registered branch coordinates.
              </p>
              <p>
                Employees attempting to mark attendance outside the branch radius will be prevented from punching or marked with an out-of-boundary alert.
              </p>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 font-medium text-[11px]">
                You can customize each branch's geofence radius under <strong>Company Details → My Branches</strong>.
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
