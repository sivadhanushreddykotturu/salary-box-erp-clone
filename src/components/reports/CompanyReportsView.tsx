"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  RefreshCw,
  Download,
  Calendar,
  Check,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { PayslipModal } from "./PayslipModal";

export interface RecentReportItem {
  id: string;
  reportType: string;
  branch: string;
  department: string;
  duration: string;
  format: "XLSX" | "PDF" | "CSV";
  generatedOn: string;
  status: "Download" | "Processing" | "Ready";
}

const INITIAL_RECENT_REPORTS: RecentReportItem[] = [
  {
    id: "tax-1",
    reportType: "Bobba Prasad Tax Report",
    branch: "All Branches",
    department: "All Departments",
    duration: "01 Apr 2026 - 31 Mar 2027",
    format: "XLSX",
    generatedOn: "04-Sep-2026 01:12 AM",
    status: "Download",
  },
  {
    id: "crm-1",
    reportType: "CRM Meeting Detailed Report",
    branch: "All Branches",
    department: "All Departments",
    duration: "03 Sep 2026 - 03 Sep 2026",
    format: "XLSX",
    generatedOn: "03-Sep-2026 12:02 PM",
    status: "Download",
  },
  {
    id: "payslip-1",
    reportType: "Pay Slips",
    branch: "All Branches",
    department: "All Departments",
    duration: "01 Aug 2026 - 26 Aug 2026",
    format: "PDF",
    generatedOn: "26-Aug-2026 04:24 PM",
    status: "Download",
  },
  {
    id: "att-1",
    reportType: "Company Attendance",
    branch: "All Branches",
    department: "All Departments",
    duration: "01 Jun 2026 - 26 Jun 2026",
    format: "XLSX",
    generatedOn: "26-Jun-2026 10:18 PM",
    status: "Download",
  },
];

export function CompanyReportsView() {
  const router = useRouter();

  // Instant render states
  const [activeTab, setActiveTab] = useState<"Attendance" | "Payroll" | "Notes" | "Employee List" | "CRM">("Attendance");
  const [reportType, setReportType] = useState("Daily Attendance Report");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedDate, setSelectedDate] = useState("2026-09-05");
  const [format, setFormat] = useState<"XLSX" | "PDF" | "CSV">("XLSX");

  const [recentReports, setRecentReports] = useState<RecentReportItem[]>(INITIAL_RECENT_REPORTS);
  const [branches, setBranches] = useState<string[]>(["All Branches", "Addanki", "Guntur", "VIJAYAWADA"]);
  const [departments, setDepartments] = useState<string[]>([
    "All Departments",
    "Management",
    "Operations",
    "Field Logistics",
    "Accounts & Finance",
    "HR & Administration",
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tabs: ("Attendance" | "Payroll" | "Notes" | "Employee List" | "CRM")[] = [
    "Attendance",
    "Payroll",
    "Notes",
    "Employee List",
    "CRM",
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Background non-blocking fetch for dynamic branches & departments
  useEffect(() => {
    async function loadMeta() {
      try {
        const [branchRes, deptRes] = await Promise.all([
          fetch("/api/v1/branches"),
          fetch("/api/v1/departments"),
        ]);
        if (branchRes.ok) {
          const json = await branchRes.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            setBranches(["All Branches", ...json.data.map((b: any) => b.name)]);
          }
        }
        if (deptRes.ok) {
          const json = await deptRes.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            setDepartments(["All Departments", ...json.data.map((d: any) => d.name)]);
          }
        }
      } catch (e) {
        // Fallback states already active
      }
    }
    loadMeta();
  }, []);

  // Format date helper: 05 Sep 2026
  const formatDisplayDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "05 Sep 2026";
      const day = String(d.getDate()).padStart(2, "0");
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const mon = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${mon} ${year}`;
    } catch {
      return "05 Sep 2026";
    }
  };

  const handleTabChange = (tab: "Attendance" | "Payroll" | "Notes" | "Employee List" | "CRM") => {
    setActiveTab(tab);
    if (tab === "Attendance") {
      setReportType("Daily Attendance Report");
      setFormat("XLSX");
    } else if (tab === "Payroll") {
      setReportType("Pay Slips");
      setFormat("PDF");
    } else if (tab === "Employee List") {
      setReportType("Employee Master List");
      setFormat("XLSX");
    } else if (tab === "Notes") {
      setReportType("Staff Notes Report");
      setFormat("XLSX");
    } else if (tab === "CRM") {
      setReportType("CRM Meeting Detailed Report");
      setFormat("XLSX");
    }
  };

  // Generate Report Action
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mon = months[now.getMonth()];
    const year = now.getFullYear();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${day}-${mon}-${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    setTimeout(() => {
      const newReport: RecentReportItem = {
        id: `report-${Date.now()}`,
        reportType,
        branch: selectedBranch,
        department: selectedDept,
        duration: `${formatDisplayDate(selectedDate)} - ${formatDisplayDate(selectedDate)}`,
        format,
        generatedOn: timeStr,
        status: "Download",
      };

      setRecentReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      showToast(`${reportType} generated successfully`);
    }, 400);
  };

  // Refresh recent reports
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Recent reports refreshed");
    }, 300);
  };

  // Download export
  const handleDownload = (report: RecentReportItem) => {
    if (report.reportType === "Pay Slips") {
      setIsPayslipModalOpen(true);
      return;
    }

    const sampleRows = [
      ["Company", "RSS LOGISTICS"],
      ["Report Type", report.reportType],
      ["Branch", report.branch],
      ["Department", report.department],
      ["Duration", report.duration],
      ["Generated On", report.generatedOn],
      [],
      ["Emp Code", "Staff Name", "Branch", "Designation", "Status", "Punches (In/Out)", "Total Hours"],
      ["EMP001", "Bobba Prasad", "Addanki", "Technician", "Present", "09:02 AM - 06:14 PM", "9h 12m"],
      ["EMP002", "DARA DEEKSHITH", "Guntur", "Executive", "Present", "08:56 AM - 06:05 PM", "9h 09m"],
      ["EMP003", "Durga Prasad Cargo CUG", "VIJAYAWADA", "Fleet Lead", "Present", "10:39 AM - 06:00 PM", "7h 21m"],
      ["EMP004", "Medipalli Nanibabu", "Addanki", "Supervisor", "Present", "10:52 AM - 06:30 PM", "7h 38m"],
      ["EMP005", "Priyanka EDP RSS VJA", "VIJAYAWADA", "EDP Admin", "Present", "09:39 AM - 06:10 PM", "8h 31m"],
      ["EMP006", "Rajesh Service Manager", "Guntur", "Manager", "Present", "09:00 AM - 06:00 PM", "9h 00m"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + sampleRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${report.reportType.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${report.reportType}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/setting")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Back to settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Company Reports</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. REPORT GENERATOR CARD (Screenshot 1 top card) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Tab Bar */}
          <div className="border-b border-slate-200 px-6 flex items-center gap-8 overflow-x-auto text-xs font-medium text-slate-600 bg-white">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`py-3.5 whitespace-nowrap transition-colors relative cursor-pointer ${
                    isActive
                      ? "text-[#1877F2] font-semibold border-b-2 border-[#1877F2]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Form Controls Grid matching Screenshot */}
          <form onSubmit={handleGenerateReport} className="p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {/* Field 1: Report Type */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Report Type
                </label>
                <div className="relative">
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer pr-8"
                  >
                    {activeTab === "Attendance" && (
                      <>
                        <option>Daily Attendance Report</option>
                        <option>Company Attendance</option>
                        <option>Staff Punch Logs Report</option>
                        <option>Monthly Attendance Register</option>
                      </>
                    )}
                    {activeTab === "Payroll" && (
                      <>
                        <option>Pay Slips</option>
                        <option>Monthly Salary Register</option>
                        <option>Bobba Prasad Tax Report</option>
                        <option>PF / ESI Compliance Report</option>
                      </>
                    )}
                    {activeTab === "Notes" && (
                      <>
                        <option>Staff Notes Report</option>
                        <option>Company Bulletins & Announcements</option>
                      </>
                    )}
                    {activeTab === "Employee List" && (
                      <>
                        <option>Employee Master List</option>
                        <option>Active Staff Summary</option>
                        <option>Department-wise Roster</option>
                      </>
                    )}
                    {activeTab === "CRM" && (
                      <>
                        <option>CRM Meeting Detailed Report</option>
                        <option>Leads & Customer Pipeline</option>
                        <option>Staff Activity Log</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Select Branch */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Select Branch
                </label>
                <div className="relative">
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer pr-8"
                  >
                    {branches.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Field 3: Select Department */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Select Department
                </label>
                <div className="relative">
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer pr-8"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Field 4: Date */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 5: Format */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Format
                </label>
                <div className="relative">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full text-xs text-slate-800 px-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white appearance-none cursor-pointer pr-8"
                  >
                    <option value="XLSX">XLSX</option>
                    <option value="PDF">PDF</option>
                    <option value="CSV">CSV</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Generate Button & Subtext */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-6 py-2 rounded transition-colors disabled:opacity-60 shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isGenerating ? "Generating..." : "Generate Report"}</span>
              </button>

              <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed">
                Some reports might take time to generate. Once these are done, you can download all the reports generated from the list below.
              </p>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* 2. RECENT REPORTS CARD (Screenshot 1 bottom card) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Card Top: Recent Reports + Refresh Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
              Recent Reports
            </h2>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">REPORT TYPE</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">FORMAT</th>
                  <th className="py-3 px-4">GENERATED ON</th>
                  <th className="py-3 px-6 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {report.reportType}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                        {report.branch}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                        {report.department}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                      {report.duration}
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {report.format}
                    </td>

                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {report.generatedOn}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(report)}
                        className="text-[#1877F2] hover:text-blue-700 font-semibold text-xs cursor-pointer hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payslip Modal Component */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
      />
    </div>
  );
}
