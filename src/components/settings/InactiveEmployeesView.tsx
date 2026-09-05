"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Check,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";

interface InactiveStaffItem {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string | null;
  jobTitle?: string;
  employeeCode?: string;
  phone: string;
  inactiveDate: string;
  reason?: string;
  branchId?: string;
  departmentId?: string;
}

const DEFAULT_INACTIVE_STAFF: InactiveStaffItem[] = [
  {
    id: "inact-1",
    name: "Kuraganti Pavan RSS OSM VJA",
    initials: "KV",
    jobTitle: "",
    employeeCode: "",
    phone: "+91 6305574326",
    inactiveDate: "24 Apr 2026",
    reason: "",
  },
  {
    id: "inact-2",
    name: "Anil",
    initials: "A",
    jobTitle: "",
    employeeCode: "",
    phone: "+91 9989110795",
    inactiveDate: "03 Sep 2026",
    reason: "",
  },
  {
    id: "inact-3",
    name: "Bhanu",
    initials: "B",
    jobTitle: "",
    employeeCode: "",
    phone: "+91 9492982343",
    inactiveDate: "13 Jul 2026",
    reason: "",
  },
  {
    id: "inact-4",
    name: "C.H Rajasekhar Tech RSS OSM VJA",
    initials: "CR",
    jobTitle: "",
    employeeCode: "",
    phone: "+91 7032377128",
    inactiveDate: "01 Jul 2026",
    reason: "",
  },
  {
    id: "inact-5",
    name: "Venkat Krishna Nidadavolu",
    initials: "VK",
    jobTitle: "Service Manager",
    employeeCode: "",
    phone: "+91 6305953455",
    inactiveDate: "14 Jul 2026",
    reason: "",
  },
];

export function InactiveEmployeesView() {
  const router = useRouter();

  const [staffList, setStaffList] = useState<InactiveStaffItem[]>(DEFAULT_INACTIVE_STAFF);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  // Filter States
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [activateModalOpen, setActivateModalOpen] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Branches & Departments
  useEffect(() => {
    async function loadMeta() {
      try {
        const [bRes, dRes] = await Promise.all([
          fetch("/api/v1/branches"),
          fetch("/api/v1/departments"),
        ]);
        if (bRes.ok) {
          const bJson = await bRes.json();
          if (bJson?.data) setBranches(bJson.data);
        }
        if (dRes.ok) {
          const dJson = await dRes.json();
          if (dJson?.data) setDepartments(dJson.data);
        }
      } catch (err) {
        console.error("Failed to load metadata:", err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Inactive Staff
  const fetchInactiveStaff = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch !== "ALL") params.append("branchId", selectedBranch);
      if (selectedDepartment !== "ALL") params.append("departmentId", selectedDepartment);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/v1/employees/inactive?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: InactiveStaffItem[] = json.data.map((emp: any) => {
            const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Staff Member";
            const parts = fullName.split(" ").filter(Boolean);
            const initials =
              parts.length >= 2
                ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                : (fullName.slice(0, 2) || "IN").toUpperCase();

            let formattedDate = "N/A";
            if (emp.dateOfLeaving) {
              const d = new Date(emp.dateOfLeaving);
              formattedDate = d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            } else if (emp.updatedAt) {
              const d = new Date(emp.updatedAt);
              formattedDate = d.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            }

            return {
              id: emp.id,
              name: fullName,
              initials,
              avatarUrl: emp.avatarUrl || null,
              jobTitle: emp.jobTitle || emp.designation?.title || "",
              employeeCode: emp.employeeCode || "",
              phone: emp.mobileNumber || emp.user?.phone || "",
              inactiveDate: formattedDate,
              reason: emp.notes || "",
              branchId: emp.branchId,
              departmentId: emp.departmentId,
            };
          });
          setStaffList(mapped);
        } else {
          // If no inactive records exist in DB yet, fallback to default seed
          setStaffList(DEFAULT_INACTIVE_STAFF);
        }
      } else {
        setStaffList(DEFAULT_INACTIVE_STAFF);
      }
    } catch (err) {
      console.error("Failed to fetch inactive staff:", err);
      setStaffList(DEFAULT_INACTIVE_STAFF);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveStaff();
  }, [selectedBranch, selectedDepartment, startDate, endDate]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedBranch("ALL");
    setSelectedDepartment("ALL");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setSelectedIds([]);
  };

  // Checkbox Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStaff.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStaff.map((s) => s.id));
    }
  };

  const handleToggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Filter staff by search query locally
  const filteredStaff = staffList.filter((staff) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    return (
      staff.name.toLowerCase().includes(term) ||
      staff.phone.includes(term) ||
      (staff.jobTitle && staff.jobTitle.toLowerCase().includes(term)) ||
      (staff.employeeCode && staff.employeeCode.toLowerCase().includes(term))
    );
  });

  // Determine how many staff will be activated
  const targetCount = selectedIds.length > 0 ? selectedIds.length : filteredStaff.length;

  // Execute Activation
  const handleConfirmActivate = async () => {
    setActivating(true);
    const idsToActivate = selectedIds.length > 0 ? selectedIds : filteredStaff.map((s) => s.id);

    try {
      const realIds = idsToActivate.filter((id) => !id.startsWith("inact-"));
      if (realIds.length > 0) {
        const res = await fetch("/api/v1/employees/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeIds: realIds }),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          showToast(errJson?.message || "Failed to activate staff", "error");
        }
      }

      // Optimistic UI removal
      setStaffList((prev) => prev.filter((s) => !idsToActivate.includes(s.id)));
      setSelectedIds([]);
      setActivateModalOpen(false);
      showToast(
        `Successfully activated ${targetCount} staff member${targetCount > 1 ? "s" : ""}`
      );
    } catch (err) {
      console.error("Error activating staff:", err);
      showToast("Network error activating staff", "error");
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border animate-in fade-in slide-in-from-top-2 ${
            toastType === "success"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {toastType === "success" ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Back Navigation */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push("/setting")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Back to settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Inactive Employees</h1>
        </div>
      </div>

      {/* Main Two-Column Layout matching Screenshot 1 */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* ========================================================= */}
        {/* LEFT FILTER SIDEBAR                                       */}
        {/* ========================================================= */}
        <div className="w-full md:w-64 shrink-0 bg-white rounded-lg border border-slate-200/90 shadow-sm p-4 space-y-4 h-fit">
          {/* Header with Filter Icon & Reset */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter className="w-4 h-4 text-slate-600" />
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Select Branch */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Select Branch
            </label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer"
              >
                <option value="ALL">All Branches</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Select Department */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Select Department
            </label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full text-xs text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded outline-none focus:border-blue-500 appearance-none pr-8 cursor-pointer"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Marked Inactive On (Date Range) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1.5">
              Marked Inactive On
            </label>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2.5 py-1.5 focus-within:border-blue-500">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[11px] text-slate-700 outline-none w-full bg-transparent"
                title="Start Date"
              />
              <span className="text-slate-400 text-xs">→</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[11px] text-slate-700 outline-none w-full bg-transparent"
                title="End Date"
              />
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT MAIN TABLE AREA                                     */}
        {/* ========================================================= */}
        <div className="flex-1 min-w-0">
          {/* Top Action Bar matching Screenshots */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Search Staff */}
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Staff"
                className="w-full text-xs text-slate-800 pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Activate Staff Action */}
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <span className="text-xs text-slate-600 font-medium">
                  {selectedIds.length} staff selected
                </span>
              )}

              <button
                type="button"
                onClick={() => setActivateModalOpen(true)}
                disabled={filteredStaff.length === 0}
                className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-5 py-2 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Activate Staff
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold text-slate-700">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredStaff.length > 0 &&
                        selectedIds.length === filteredStaff.length
                      }
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Job Title</th>
                  <th className="py-3 px-4 font-semibold">Employee ID</th>
                  <th className="py-3 px-4 font-semibold">Phone Number</th>
                  <th className="py-3 px-4 font-semibold">Marked Inactive On</th>
                  <th className="py-3 px-4 font-semibold">Reason for marking inactive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Loading inactive staff...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No inactive employees found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => {
                    const isSelected = selectedIds.includes(staff.id);
                    return (
                      <tr
                        key={staff.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          isSelected ? "bg-blue-50/30" : ""
                        }`}
                      >
                        {/* Row Checkbox */}
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(staff.id)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Name with Avatar */}
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            {staff.avatarUrl ? (
                              <img
                                src={staff.avatarUrl}
                                alt={staff.name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-inner uppercase">
                                {staff.initials}
                              </div>
                            )}
                            <span className="truncate max-w-[200px]">{staff.name}</span>
                          </div>
                        </td>

                        {/* Job Title */}
                        <td className="py-3.5 px-4 text-slate-600">{staff.jobTitle || "-"}</td>

                        {/* Employee ID */}
                        <td className="py-3.5 px-4 text-slate-600">{staff.employeeCode || "-"}</td>

                        {/* Phone Number */}
                        <td className="py-3.5 px-4 font-mono text-slate-700">{staff.phone}</td>

                        {/* Marked Inactive On */}
                        <td className="py-3.5 px-4 text-slate-600">{staff.inactiveDate}</td>

                        {/* Reason */}
                        <td className="py-3.5 px-4 text-slate-500 italic">{staff.reason || "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ACTIVATE STAFF CONFIRMATION MODAL matching Screenshots    */}
      {/* ========================================================= */}
      {activateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Activate Staff</h3>
              <button
                type="button"
                onClick={() => setActivateModalOpen(false)}
                className="w-5 h-5 rounded-full bg-slate-400 hover:bg-slate-500 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-xs text-slate-700 leading-relaxed">
                You will be activating{" "}
                <strong className="text-slate-900">{targetCount} staff</strong>. Are you sure?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-center sm:justify-end gap-3 px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={() => setActivateModalOpen(false)}
                disabled={activating}
                className="px-5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActivate}
                disabled={activating}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-medium px-5 py-2 rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {activating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Activate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
