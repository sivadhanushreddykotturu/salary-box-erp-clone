"use client";

import React, { useState } from "react";
import { ChevronDown, RefreshCw, Download } from "lucide-react";
import { PayslipModal } from "./PayslipModal";

interface RecentReportItem {
  id: string;
  reportType: string;
  branch: string;
  department: string;
  duration: string;
  format: "PDF" | "XLSX";
  generatedOn: string;
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
  },
  {
    id: "crm-1",
    reportType: "CRM Meeting Detailed Report",
    branch: "All Branches",
    department: "All Departments",
    duration: "03 Sep 2026 - 03 Sep 2026",
    format: "XLSX",
    generatedOn: "03-Sep-2026 12:02 PM",
  },
  {
    id: "1",
    reportType: "Pay Slips",
    branch: "All Branches",
    department: "All Departments",
    duration: "01 Aug 2026 - 26 Aug 2026",
    format: "PDF",
    generatedOn: "26-Aug-2026 04:24 PM",
  },
  {
    id: "2",
    reportType: "Company Attendance Summary Report",
    branch: "All Branches",
    department: "All Departments",
    duration: "01 Jun 2026 - 26 Jun 2026",
    format: "XLSX",
    generatedOn: "26 Jun 2026 10:18 PM",
  },
];

export function DownloadReportsView() {
  const [activeTab, setActiveTab] = useState<"Attendance" | "Payroll" | "Notes" | "Employee List" | "CRM">("Attendance");
  const [reportType, setReportType] = useState("Daily Attendance Report");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedDate, setSelectedDate] = useState("2026-09-03");
  const [format, setFormat] = useState<"XLSX" | "PDF">("XLSX");
  const [recentReports, setRecentReports] = useState<RecentReportItem[]>(INITIAL_RECENT_REPORTS);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs: ("Attendance" | "Payroll" | "Notes" | "Employee List" | "CRM")[] = [
    "Attendance",
    "Payroll",
    "Notes",
    "Employee List",
    "CRM",
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newReport: RecentReportItem = {
        id: String(Date.now()),
        reportType,
        branch: selectedBranch,
        department: selectedDept,
        duration: `${selectedDate}`,
        format,
        generatedOn: "Just Now",
      };

      setRecentReports([newReport, ...recentReports]);
      setIsGenerating(false);
    }, 500);
  };

  const handleDownloadClick = (report: RecentReportItem) => {
    if (report.reportType === "Pay Slips") {
      setIsPayslipModalOpen(true);
      return;
    }

    // Trigger actual CSV / Excel download
    const sampleData = [
      ["Employee ID", "Name", "Branch", "Department", "Date", "Status", "First In", "Last Out"],
      ["EMP001", "Anil", "HQ Bangalore", "Operations", "2026-09-03", "Present", "09:02 AM", "06:14 PM"],
      ["EMP002", "Bobba Prasad", "VIJAYAWADA", "Technicians", "2026-09-03", "Present", "08:56 AM", "06:05 PM"],
      ["EMP003", "DARA DEEKSHITH", "VIJAYAWADA", "Operations", "2026-09-03", "Present", "10:39 AM", "06:00 PM"],
      ["EMP004", "Durga Prasad Cargo CUG", "VIJAYAWADA", "Cargo", "2026-09-03", "Present", "10:52 AM", "06:30 PM"],
      ["EMP005", "Medipalli Nanibabu", "VIJAYAWADA", "Technicians", "2026-09-03", "Present", "10:37 AM", "06:15 PM"],
      ["EMP006", "Priyanka EDP RSS VJA", "VIJAYAWADA", "EDP", "2026-09-03", "Present", "09:39 AM", "06:10 PM"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      sampleData.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${report.reportType.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-base font-bold text-slate-800 tracking-tight">Download Reports</h1>
        </div>

        <div className="border-b border-slate-200 px-4 flex items-center gap-8 overflow-x-auto text-xs font-medium text-slate-600">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "Payroll") {
                    setReportType("Pay Slips");
                    setFormat("PDF");
                  } else if (tab === "Attendance") {
                    setReportType("Daily Attendance Report");
                    setFormat("XLSX");
                  }
                }}
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

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Report Type</label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {activeTab === "Attendance" && (
                    <>
                      <option>Daily Attendance Report</option>
                      <option>Company Attendance Summary Report</option>
                      <option>Staff Punch Logs Report</option>
                    </>
                  )}
                  {activeTab === "Payroll" && (
                    <>
                      <option>Pay Slips</option>
                      <option>Monthly Payroll Register</option>
                      <option>PF / ESI Compliance Report</option>
                    </>
                  )}
                  {activeTab === "Employee List" && <option>Employee Master List</option>}
                  {activeTab === "Notes" && <option>Company Notes & Bulletins</option>}
                  {activeTab === "CRM" && <option>Lead Pipeline & Activities</option>}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
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
                  <option>VIJAYAWADA</option>
                  <option>Addanki</option>
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
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Format</label>
              <div className="relative">
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-200 bg-white text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="XLSX">XLSX</option>
                  <option value="PDF">PDF</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors"
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Some reports might take time to generate. Once these are done, you can download all the reports generated from the list below.
            </p>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Recent Reports</h2>
          <button
            onClick={() => alert("Recent reports refreshed")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">REPORT TYPE</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">FORMAT</th>
                <th className="px-4 py-3">GENERATED ON</th>
                <th className="px-4 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-900">{report.reportType}</td>
                  <td className="px-4 py-3.5 text-slate-600">{report.branch}</td>
                  <td className="px-4 py-3.5 text-slate-600">{report.department}</td>
                  <td className="px-4 py-3.5 text-slate-600">{report.duration}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{report.format}</td>
                  <td className="px-4 py-3.5 text-slate-500">{report.generatedOn}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDownloadClick(report)}
                      className="text-[#007BFF] font-semibold hover:underline cursor-pointer"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
      />
    </div>
  );
}