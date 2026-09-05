"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Check,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";

export const AVAILABLE_ROLES = [
  "Employee",
  "Branch Admin",
  "Attendance Manager",
  "Custom",
  "Advanced Attendance Manager",
] as const;

export type StaffRole = (typeof AVAILABLE_ROLES)[number];

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  avatarColor?: string;
  avatarUrl?: string | null;
  userRole: StaffRole;
  phone?: string;
  department?: string;
}

const DEFAULT_STAFF_LIST: StaffMember[] = [
  {
    id: "emp-1",
    name: "Bobba Prasad",
    initials: "BP",
    avatarColor: "bg-blue-500",
    userRole: "Employee",
    phone: "+91 94401 11223",
  },
  {
    id: "emp-2",
    name: "DARA DEEKSHITH",
    initials: "DD",
    avatarColor: "bg-emerald-500",
    userRole: "Employee",
    phone: "+91 98852 33445",
  },
  {
    id: "emp-3",
    name: "Durga Prasad Cargo CUG",
    initials: "DP",
    avatarColor: "bg-purple-500",
    userRole: "Employee",
    phone: "+91 91234 56789",
  },
  {
    id: "emp-4",
    name: "Medipalli Nanibabu",
    initials: "MN",
    avatarColor: "bg-amber-500",
    userRole: "Employee",
    phone: "+91 95501 23456",
  },
  {
    id: "emp-5",
    name: "Priyanka EDP RSS VJA",
    initials: "P",
    avatarColor: "bg-pink-500",
    userRole: "Employee",
    phone: "+91 96602 34567",
  },
  {
    id: "emp-6",
    name: "Rajesh Service Manager CUG OSM VJA",
    initials: "R",
    avatarColor: "bg-indigo-500",
    userRole: "Employee",
    phone: "+91 97703 45678",
  },
  {
    id: "emp-7",
    name: "Saleem",
    initials: "S",
    avatarColor: "bg-teal-500",
    userRole: "Employee",
    phone: "+91 98804 56789",
  },
  {
    id: "emp-8",
    name: "Shaaru",
    initials: "S",
    avatarColor: "bg-rose-500",
    userRole: "Employee",
    phone: "+91 99905 67890",
  },
];

export function EmployeesManagersView() {
  const router = useRouter();

  const [staffList, setStaffList] = useState<StaffMember[]>(DEFAULT_STAFF_LIST);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // Dropdown open state: stores employee ID of active open dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch staff list from MongoDB API
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/v1/employees");
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: StaffMember[] = json.data.map((emp: any) => {
              const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || "Employee";
              const parts = fullName.split(" ").filter(Boolean);
              const initials =
                parts.length >= 2
                  ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                  : (fullName.slice(0, 2) || "EM").toUpperCase();

              // Validate userRole or default to Employee
              const roleVal = AVAILABLE_ROLES.includes(emp.userRole as StaffRole)
                ? (emp.userRole as StaffRole)
                : "Employee";

              return {
                id: emp.id,
                name: fullName,
                initials,
                avatarUrl: emp.avatarUrl || null,
                userRole: roleVal,
                phone: emp.mobileNumber || emp.user?.phone || "",
                department: emp.department?.name || "",
              };
            });
            setStaffList(mapped);
          } else {
            // Keep default mock list
            setStaffList(DEFAULT_STAFF_LIST);
          }
        }
      } catch (err) {
        console.error("Failed to load staff list:", err);
        setStaffList(DEFAULT_STAFF_LIST);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  // Handle Role Change
  const handleRoleSelect = async (staffId: string, newRole: StaffRole) => {
    setOpenDropdownId(null);

    // Optimistic UI update
    setStaffList((prev) =>
      prev.map((member) => (member.id === staffId ? { ...member, userRole: newRole } : member))
    );

    const targetStaff = staffList.find((s) => s.id === staffId);
    showToast(`Role updated to ${newRole} successfully`);

    // API update if it's a real DB record
    try {
      if (!staffId.startsWith("emp-")) {
        const res = await fetch(`/api/v1/employees/${staffId}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userRole: newRole }),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          showToast(errJson?.message || "Failed to update role in database", "error");
        }
      }
    } catch (err) {
      console.error("Error updating employee role:", err);
    }
  };

  // Filtered employees list based on search
  const filteredList = staffList.filter((staff) => {
    const term = (activeSearch || searchQuery).toLowerCase().trim();
    if (!term) return true;
    return (
      staff.name.toLowerCase().includes(term) ||
      (staff.phone && staff.phone.includes(term)) ||
      (staff.department && staff.department.toLowerCase().includes(term))
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchQuery);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Toast Notification */}
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

      {/* Top Header Back Navigation matching Screenshot 1 */}
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
          <h1 className="text-sm font-semibold text-slate-900">Employees & Managers</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar matching Screenshot 1 */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-6 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name of employee"
              className="w-full text-xs text-slate-800 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-6 py-2.5 rounded transition-colors shadow-sm cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Staff Table / Rows matching Screenshot 1 & 2 */}
        <div
          ref={dropdownContainerRef}
          className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-visible divide-y divide-slate-100"
        >
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading staff directory...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No staff members found matching "{searchQuery}".
            </div>
          ) : (
            filteredList.map((staff) => {
              const isDropdownOpen = openDropdownId === staff.id;

              return (
                <div
                  key={staff.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left: Avatar & Name */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    {staff.avatarUrl ? (
                      <img
                        src={staff.avatarUrl}
                        alt={staff.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-slate-700 flex items-center justify-center text-[11px] font-bold shrink-0 shadow-inner uppercase">
                        {staff.initials || "EM"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-900 truncate">
                        {staff.name}
                      </div>
                      <div className="text-[11px] text-slate-400 capitalize">
                        {staff.userRole || "Employee"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Custom Styled Role Dropdown matching Screenshot 2 */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdownId(isDropdownOpen ? null : staff.id)
                      }
                      className={`w-52 md:w-60 text-xs px-4 py-2 rounded flex items-center justify-between transition-all cursor-pointer bg-white text-slate-700 ${
                        isDropdownOpen
                          ? "border-2 border-[#38BDF8] shadow-xs"
                          : "border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className="truncate">{staff.userRole || "Employee"}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                          isDropdownOpen ? "rotate-180 text-blue-500" : ""
                        }`}
                      />
                    </button>

                    {/* Floating Dropdown Menu matching Screenshot 2 */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-52 md:w-60 bg-white border border-slate-200 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                        {AVAILABLE_ROLES.map((role) => {
                          const isSelected = staff.userRole === role;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => handleRoleSelect(staff.id, role)}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? "bg-[#E0F2FE] text-slate-900 font-semibold"
                                  : "text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              <span>{role}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
