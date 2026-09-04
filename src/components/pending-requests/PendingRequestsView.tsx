"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MoreVertical,
  X,
  FileText,
  Download,
  Check
} from "lucide-react";

interface ReimbursementItem {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  date: string;
  amount: number;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
  attachmentUrl?: string;
  branch: string;
  department: string;
}

const BRANCH_OPTIONS = ["All Branches", "VIJAYAWADA", "Addanki", "HQ Bangalore", "Guntur"];
const DEPARTMENT_OPTIONS = ["All Departments", "Operations", "Field Logistics", "Technical", "Accounts", "Management"];
const MONTH_NAMES = [
  { short: "Jan", full: "January" },
  { short: "Feb", full: "February" },
  { short: "Mar", full: "March" },
  { short: "Apr", full: "April" },
  { short: "May", full: "May" },
  { short: "Jun", full: "June" },
  { short: "Jul", full: "July" },
  { short: "Aug", full: "August" },
  { short: "Sep", full: "September" },
  { short: "Oct", full: "October" },
  { short: "Nov", full: "November" },
  { short: "Dec", full: "December" },
];

const INITIAL_REIMBURSEMENTS: ReimbursementItem[] = [
  {
    id: "1",
    name: "Priyanka EDP RSS VJA",
    initials: "PV",
    avatarColor: "bg-teal-600",
    date: "02 Sep 2026",
    amount: 200,
    notes: "fast testing",
    status: "Pending",
    branch: "VIJAYAWADA",
    department: "Operations",
  },
  {
    id: "2",
    name: "Anil",
    initials: "A",
    avatarColor: "bg-blue-500",
    date: "14 Aug 2026",
    amount: 250,
    notes: "Travel allowance to client office",
    status: "Pending",
    branch: "Addanki",
    department: "Field Logistics",
  },
  {
    id: "3",
    name: "Anil",
    initials: "A",
    avatarColor: "bg-blue-500",
    date: "12 Aug 2026",
    amount: 220,
    notes: "Food & refreshments during audit",
    status: "Pending",
    branch: "Addanki",
    department: "Field Logistics",
  },
  {
    id: "4",
    name: "Rajesh Service Manager CUG OSM VJA",
    initials: "RV",
    avatarColor: "bg-purple-600",
    date: "13 Aug 2026",
    amount: 860,
    notes: "Emergency field equipment replacement",
    status: "Pending",
    branch: "VIJAYAWADA",
    department: "Technical",
  },
  {
    id: "5",
    name: "Durga Prasad Cargo CUG",
    initials: "DC",
    avatarColor: "bg-indigo-600",
    date: "05 Aug 2026",
    amount: 520,
    notes: "Toll tax & vehicle fuel bill",
    status: "Pending",
    branch: "Guntur",
    department: "Operations",
  },
  {
    id: "6",
    name: "Durga Prasad Cargo CUG",
    initials: "DC",
    avatarColor: "bg-indigo-600",
    date: "06 Aug 2026",
    amount: 411,
    notes: "Highway pass recharge",
    status: "Pending",
    branch: "Guntur",
    department: "Operations",
  },
];

export function PendingRequestsView() {
  const [activeTab, setActiveTab] = useState<
    "leave_requests" | "device_verification" | "reimbursements" | "new_joinee"
  >("reimbursements");
  const [approvalFilter, setApprovalFilter] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<ReimbursementItem[]>(INITIAL_REIMBURSEMENTS);
  const [selectedRequest, setSelectedRequest] = useState<ReimbursementItem | null>(null);

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);

  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);

  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); // null = All Months
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setIsBranchOpen(false);
      }
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setIsMonthPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pendingCount = items.filter((i) => i.status === "Pending").length;

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item))
    );
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item))
    );
    setSelectedRequest(null);
  };

  // Real CSV File Generator and Downloader
  const handleDownloadReport = () => {
    const headers = ["ID", "Employee Name", "Branch", "Department", "Date", "Amount (INR)", "Notes", "Status"];
    const rows = filteredItems.map((r) => [
      r.id,
      `"${r.name}"`,
      `"${r.branch}"`,
      `"${r.department}"`,
      r.date,
      r.amount,
      `"${r.notes.replace(/"/g, '""')}"`,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reimbursement_requests_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = items
    .filter((item) =>
      approvalFilter === "pending" ? item.status === "Pending" : item.status !== "Pending"
    )
    .filter((item) => {
      if (!searchTerm) return true;
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((item) => {
      if (selectedBranch === "All Branches") return true;
      return item.branch === selectedBranch;
    })
    .filter((item) => {
      if (selectedDepartment === "All Departments") return true;
      return item.department === selectedDepartment;
    })
    .filter((item) => {
      if (selectedMonth) {
        return item.date.includes(selectedMonth) && item.date.includes(selectedYear.toString());
      }
      return item.date.includes(selectedYear.toString());
    });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs relative">
      {/* 1. Header with Back Arrow matching SalaryBox */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        <Link href="/my-team" className="p-1 rounded hover:bg-slate-100 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-bold text-slate-800 tracking-tight">Pending Requests</h1>
      </div>

      {/* 2. Top 4 Tabs */}
      <div className="border-b border-slate-200 px-4 flex items-center gap-6 overflow-x-auto text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab("leave_requests")}
          className={`py-3 whitespace-nowrap transition-colors relative ${
            activeTab === "leave_requests"
              ? "text-[#007BFF] font-semibold border-b-2 border-[#007BFF]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Leave Requests
        </button>

        <button
          onClick={() => setActiveTab("device_verification")}
          className={`py-3 whitespace-nowrap transition-colors relative ${
            activeTab === "device_verification"
              ? "text-[#007BFF] font-semibold border-b-2 border-[#007BFF]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Device Verification Requests
        </button>

        <button
          onClick={() => setActiveTab("reimbursements")}
          className={`py-3 whitespace-nowrap transition-colors relative ${
            activeTab === "reimbursements"
              ? "text-[#007BFF] font-semibold border-b-2 border-[#007BFF]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Reimbursement Requests ({pendingCount})
        </button>

        <button
          onClick={() => setActiveTab("new_joinee")}
          className={`py-3 whitespace-nowrap transition-colors relative ${
            activeTab === "new_joinee"
              ? "text-[#007BFF] font-semibold border-b-2 border-[#007BFF]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          New Joinee Requests
        </button>
      </div>

      {/* 3. Sub-Pills */}
      <div className="p-3 px-4 border-b border-slate-100 flex items-center gap-2 bg-[#FAFBFD]">
        <button
          onClick={() => setApprovalFilter("pending")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            approvalFilter === "pending"
              ? "bg-[#EBF5FF] text-[#007BFF] border border-blue-200 font-semibold"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>Pending (My approvals)</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setApprovalFilter("history")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            approvalFilter === "history"
              ? "bg-[#EBF5FF] text-[#007BFF] border border-blue-200 font-semibold"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          History
        </button>
      </div>

      {/* 4. Filter Bar */}
      <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative min-w-[190px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Branch Dropdown */}
          <div className="relative" ref={branchRef}>
            <button
              type="button"
              onClick={() => {
                setIsBranchOpen(!isBranchOpen);
                setIsDeptOpen(false);
                setIsMonthPickerOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                selectedBranch !== "All Branches"
                  ? "bg-blue-50 text-blue-600 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>{selectedBranch}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isBranchOpen ? "rotate-180" : ""}`} />
            </button>

            {isBranchOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                {BRANCH_OPTIONS.map((branch) => (
                  <button
                    key={branch}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setIsBranchOpen(false);
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

          {/* Department Dropdown */}
          <div className="relative" ref={deptRef}>
            <button
              type="button"
              onClick={() => {
                setIsDeptOpen(!isDeptOpen);
                setIsBranchOpen(false);
                setIsMonthPickerOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                selectedDepartment !== "All Departments"
                  ? "bg-blue-50 text-blue-600 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>{selectedDepartment}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDeptOpen ? "rotate-180" : ""}`} />
            </button>

            {isDeptOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setIsDeptOpen(false);
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

          {/* Month & Year Picker */}
          <div className="relative" ref={monthPickerRef}>
            <button
              type="button"
              onClick={() => {
                setIsMonthPickerOpen(!isMonthPickerOpen);
                setIsBranchOpen(false);
                setIsDeptOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                selectedMonth !== null
                  ? "bg-blue-50 text-blue-600 border-blue-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 font-medium"
              }`}
            >
              <span>
                {selectedMonth
                  ? `${MONTH_NAMES.find((m) => m.short === selectedMonth)?.full || selectedMonth} ${selectedYear}`
                  : `All Months (${selectedYear})`}
              </span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isMonthPickerOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-3 text-xs animate-in fade-in zoom-in-95 duration-100">
                {/* Year Navigation Header: Left Arrow, Year, Right Arrow */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedYear((prev) => prev - 1)}
                    className="p-1 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-slate-800">{selectedYear}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedYear((prev) => prev + 1)}
                    className="p-1 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* All Months Option */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMonth(null);
                    setIsMonthPickerOpen(false);
                  }}
                  className={`w-full text-center py-1.5 mb-2 rounded-lg font-semibold transition-colors ${
                    selectedMonth === null
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Months ({selectedYear})
                </button>

                {/* 12 Months Grid */}
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((m) => {
                    const isSelected = selectedMonth === m.short;
                    return (
                      <button
                        key={m.short}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(m.short);
                          setIsMonthPickerOpen(false);
                        }}
                        className={`py-2 rounded-lg text-center font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white font-bold shadow-xs"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {m.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs self-end md:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Report</span>
        </button>
      </div>

      {/* 5. Tab Content */}
      <div className="min-h-[350px]">
        {activeTab === "leave_requests" && (
          <div className="py-24 text-center text-xs font-medium text-slate-500">
            No Pending Leave Requests
          </div>
        )}

        {activeTab === "device_verification" && (
          <div className="py-24 text-center text-xs font-medium text-slate-500">
            No Pending Device Verification Requests
          </div>
        )}

        {/* Tab 3: Strict Grid-Aligned Reimbursement List matching SalaryBox exactly */}
        {activeTab === "reimbursements" && (
          <div className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="py-24 text-center text-xs font-medium text-slate-500">
                No Pending Reimbursement Requests
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRequest(item)}
                  className="px-6 py-4 grid grid-cols-12 items-center hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  {/* Column 1: Avatar + Name (cols 1-5) */}
                  <div className="col-span-5 flex items-center gap-3 pr-2">
                    <div
                      className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0 ${item.avatarColor}`}
                    >
                      {item.initials}
                    </div>
                    <span className="text-xs font-medium text-slate-800 truncate">{item.name}</span>
                  </div>

                  {/* Column 2: Date (cols 6-8) - Strictly Aligned Vertically */}
                  <div className="col-span-3 text-xs text-slate-500 text-left">
                    {item.date}
                  </div>

                  {/* Column 3: Amount (cols 9-10) - Strictly Aligned Vertically */}
                  <div className="col-span-2 text-xs font-semibold text-slate-800 text-left">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </div>

                  {/* Column 4: Status Badge & 3-Dots Menu (cols 11-12) */}
                  <div className="col-span-2 flex items-center justify-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                        item.status === "Pending"
                          ? "bg-amber-50 text-amber-600 border-amber-200"
                          : item.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {item.status}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(item);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "new_joinee" && (
          <div className="py-24 text-center text-xs font-medium text-slate-500">
            No Joinee Requests
          </div>
        )}
      </div>

      {/* 6. Slide-Over Side Drawer matching SalaryBox */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${selectedRequest.avatarColor}`}
                  >
                    {selectedRequest.initials}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[160px]">
                    {selectedRequest.name}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    selectedRequest.status === "Pending"
                      ? "bg-amber-50 text-amber-600 border-amber-200"
                      : selectedRequest.status === "Approved"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

              {/* Drawer Body */}
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium mb-1">Reimbursement Amount</div>
                  <div className="text-base font-bold text-slate-900">
                    ₹{selectedRequest.amount.toLocaleString("en-IN")}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium mb-1">Date</div>
                  <div className="font-semibold text-slate-800">{selectedRequest.date}</div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium mb-1">Notes</div>
                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                    {selectedRequest.notes}
                  </div>
                </div>

                <div>
                  <div className="text-slate-500 font-medium mb-2">Attachment</div>
                  <div className="border border-slate-200 rounded-lg p-2 flex items-center gap-3 bg-slate-50/50 hover:bg-slate-100/60 cursor-pointer">
                    <div className="w-12 h-14 bg-white rounded border border-slate-200 flex flex-col items-center justify-center text-slate-400 shadow-xs">
                      <FileText className="w-5 h-5 text-blue-500 mb-0.5" />
                      <span className="text-[9px] font-bold text-slate-500">BILL</span>
                    </div>
                    <div className="text-[11px]">
                      <div className="font-semibold text-slate-800">receipt_bill_{selectedRequest.id}.pdf</div>
                      <div className="text-slate-400 text-[10px]">142 KB • Click to preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white">
              <button
                type="button"
                onClick={() => handleReject(selectedRequest.id)}
                className="py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => handleApprove(selectedRequest.id)}
                className="py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}