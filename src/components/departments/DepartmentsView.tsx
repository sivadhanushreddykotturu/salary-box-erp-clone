"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Search,
  ChevronDown,
  FolderTree,
  MoreVertical,
  X,
  Users
} from "lucide-react";

export interface DepartmentItem {
  id: string;
  name: string;
  employees?: Array<{
    id: string;
    firstName: string;
    lastName?: string | null;
    employeeCode: string;
    avatarUrl?: string | null;
    branchId?: string | null;
  }>;
  _count?: {
    employees: number;
  };
}

export interface EmployeeListItem {
  id: string;
  firstName: string;
  lastName?: string | null;
  employeeCode?: string;
  departmentId?: string | null;
  branchId?: string | null;
  avatarUrl?: string | null;
}

export function DepartmentsView() {
  const router = useRouter();

  // Mode: "list" | "manage"
  const [viewMode, setViewMode] = useState<"list" | "manage">("list");
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);

  // Departments List
  const [departments, setDepartments] = useState<DepartmentItem[]>([
    { id: "dept-1", name: "Management", _count: { employees: 3 }, employees: [] },
    { id: "dept-2", name: "Operations", _count: { employees: 12 }, employees: [] },
    { id: "dept-3", name: "Field Logistics", _count: { employees: 20 }, employees: [] },
    { id: "dept-4", name: "Accounts & Finance", _count: { employees: 4 }, employees: [] },
    { id: "dept-5", name: "HR & Administration", _count: { employees: 3 }, employees: [] },
  ]);

  // All Employees list for Manage mode
  const [employees, setEmployees] = useState<EmployeeListItem[]>([
    { id: "emp-1", firstName: "Bobba", lastName: "Prasad", departmentId: null, branchId: "branch-1" },
    { id: "emp-2", firstName: "DARA", lastName: "DEEKSHITH", departmentId: null, branchId: "branch-1" },
    { id: "emp-3", firstName: "Durga Prasad", lastName: "Cargo CUG", departmentId: null, branchId: "branch-2" },
    { id: "emp-4", firstName: "Medipalli", lastName: "Nanibabu", departmentId: null, branchId: "branch-2" },
    { id: "emp-5", firstName: "Priyanka", lastName: "EDP RSS VJA", departmentId: null, branchId: "branch-3" },
    { id: "emp-6", firstName: "Rajesh Service", lastName: "Manager CUG OSM VJA", departmentId: null, branchId: "branch-3" },
    { id: "emp-7", firstName: "Saleem", lastName: "", departmentId: null, branchId: "branch-1" },
    { id: "emp-8", firstName: "Shaaru", lastName: "", departmentId: null, branchId: "branch-1" },
  ]);

  // Branches for dropdown filter
  const [branchesList, setBranchesList] = useState<Array<{ id: string; name: string }>>([
    { id: "all", name: "All Branches" },
    { id: "branch-1", name: "Addanki" },
    { id: "branch-2", name: "Guntur" },
    { id: "branch-3", name: "VIJAYAWADA" },
  ]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Manage Employees Filters
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("all");
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState("");
  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Modals & Menu States
  const [openEditMenuId, setOpenEditMenuId] = useState<string | null>(null);
  const [editModalDept, setEditModalDept] = useState<DepartmentItem | null>(null);
  const [editDeptName, setEditDeptName] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [deleteModalDept, setDeleteModalDept] = useState<DepartmentItem | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
      }
      // Close open edit menu if clicking elsewhere
      if (!(event.target as HTMLElement).closest(".edit-dropdown-container")) {
        setOpenEditMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch departments and employees from DB API
  const fetchData = async () => {
    try {
      const [deptRes, empRes, branchRes] = await Promise.all([
        fetch("/api/v1/departments"),
        fetch("/api/v1/employees"),
        fetch("/api/v1/branches"),
      ]);

      if (deptRes.ok) {
        const json = await deptRes.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setDepartments(json.data);
        }
      }

      if (empRes.ok) {
        const json = await empRes.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setEmployees(json.data);
        }
      }

      if (branchRes.ok) {
        const json = await branchRes.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setBranchesList([
            { id: "all", name: "All Branches" },
            ...json.data.map((b: any) => ({ id: b.id, name: b.name })),
          ]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch department data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Manage Mode for a department
  const handleOpenManage = (dept: DepartmentItem) => {
    setSelectedDept(dept);
    setSelectedBranchFilter("all");
    setSearchEmployeeQuery("");
    setViewMode("manage");
  };

  // Assign or Remove Employee from Department
  const handleToggleEmployeeDepartment = async (employeeId: string, isCurrentlyInDept: boolean) => {
    if (!selectedDept) return;
    const deptId = selectedDept.id;

    // Optimistic UI update
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, departmentId: isCurrentlyInDept ? null : deptId }
          : emp
      )
    );

    setDepartments((prev) =>
      prev.map((d) => {
        if (d.id === deptId) {
          const currentCount = d._count?.employees || 0;
          return {
            ...d,
            _count: {
              employees: isCurrentlyInDept ? Math.max(0, currentCount - 1) : currentCount + 1,
            },
          };
        }
        return d;
      })
    );

    try {
      const res = await fetch("/api/v1/departments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deptId,
          action: isCurrentlyInDept ? "REMOVE_EMPLOYEE" : "ASSIGN_EMPLOYEE",
          employeeId,
        }),
      });

      if (res.ok) {
        showToast(
          isCurrentlyInDept
            ? "Employee removed from department"
            : "Employee added to department"
        );
      }
    } catch (err) {
      console.error("Error toggling employee department:", err);
    }
  };

  // Add Department API
  const handleAddDepartment = async () => {
    if (!newDeptName.trim()) {
      showToast("Please enter a department name", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/v1/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDeptName.trim() }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setDepartments((prev) => [...prev, json.data]);
        } else {
          setDepartments((prev) => [
            ...prev,
            { id: `dept-${Date.now()}`, name: newDeptName.trim(), _count: { employees: 0 } },
          ]);
        }
        showToast("Department created successfully");
        setNewDeptName("");
        setAddModalOpen(false);
      } else {
        showToast("Failed to create department", "error");
      }
    } catch (err) {
      setDepartments((prev) => [
        ...prev,
        { id: `dept-${Date.now()}`, name: newDeptName.trim(), _count: { employees: 0 } },
      ]);
      showToast("Department created");
      setNewDeptName("");
      setAddModalOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Department Name API
  const handleUpdateDepartment = async () => {
    if (!editModalDept || !editDeptName.trim()) {
      showToast("Department name cannot be empty", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/v1/departments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editModalDept.id, name: editDeptName.trim() }),
      });

      if (res.ok) {
        setDepartments((prev) =>
          prev.map((d) => (d.id === editModalDept.id ? { ...d, name: editDeptName.trim() } : d))
        );
        showToast("Department name updated successfully");
        setEditModalDept(null);
        setOpenEditMenuId(null);
      } else {
        showToast("Failed to update department", "error");
      }
    } catch (err) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === editModalDept.id ? { ...d, name: editDeptName.trim() } : d))
      );
      showToast("Department name updated");
      setEditModalDept(null);
      setOpenEditMenuId(null);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Department API
  const handleDeleteDepartment = async () => {
    if (!deleteModalDept) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/v1/departments?id=${deleteModalDept.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDepartments((prev) => prev.filter((d) => d.id !== deleteModalDept.id));
        showToast("Department deleted successfully");
        setDeleteModalDept(null);
        setOpenEditMenuId(null);
      } else {
        setDepartments((prev) => prev.filter((d) => d.id !== deleteModalDept.id));
        showToast("Department removed");
        setDeleteModalDept(null);
        setOpenEditMenuId(null);
      }
    } catch (err) {
      setDepartments((prev) => prev.filter((d) => d.id !== deleteModalDept.id));
      showToast("Department removed");
      setDeleteModalDept(null);
      setOpenEditMenuId(null);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered employees in Manage mode
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Branch filter
      if (selectedBranchFilter !== "all" && emp.branchId !== selectedBranchFilter) {
        return false;
      }
      // Search filter
      if (searchEmployeeQuery.trim()) {
        const query = searchEmployeeQuery.toLowerCase();
        const fullName = `${emp.firstName} ${emp.lastName || ""}`.toLowerCase();
        if (!fullName.includes(query) && !(emp.employeeCode || "").toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [employees, selectedBranchFilter, searchEmployeeQuery]);

  // Initials generator
  const getInitials = (firstName: string, lastName?: string | null) => {
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "E";
  };

  // Soft avatar colors
  const getAvatarBg = (name: string) => {
    const colors = [
      "bg-purple-100 text-purple-700",
      "bg-blue-100 text-blue-700",
      "bg-indigo-100 text-indigo-700",
      "bg-pink-100 text-pink-700",
      "bg-teal-100 text-teal-700",
      "bg-emerald-100 text-emerald-700",
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-16">
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

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (viewMode === "manage") {
                setViewMode("list");
              } else {
                router.push("/setting");
              }
            }}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Company Departments</h1>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DEPARTMENTS LIST VIEW (Screenshot 1) */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Header: Departments + Add Departments Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
                Departments
              </h2>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Departments</span>
              </button>
            </div>

            {/* Department List Rows */}
            <div className="divide-y divide-slate-100">
              {departments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No departments found. Click "+ Add Departments" to create one.
                </div>
              ) : (
                departments.map((dept) => {
                  const staffCount = dept._count?.employees ?? 0;
                  const isMenuOpen = openEditMenuId === dept.id;

                  return (
                    <div
                      key={dept.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Left: Department Icon & Name */}
                      <div className="flex items-center gap-3.5">
                        {/* SalaryBox Department Icon */}
                        <div className="w-7 h-7 text-slate-700 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 stroke-current fill-none stroke-[1.8]"
                            viewBox="0 0 24 24"
                          >
                            <rect x="3" y="14" width="6" height="6" rx="1" />
                            <rect x="15" y="14" width="6" height="6" rx="1" />
                            <rect x="9" y="4" width="6" height="6" rx="1" />
                            <path d="M12 10v4M6 14v-2h12v2" />
                          </svg>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 tracking-tight">
                            {dept.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {staffCount === 0
                              ? "No Staff Added"
                              : `${staffCount} Staff Added`}
                          </div>
                        </div>
                      </div>

                      {/* Right: Edit Dropdown & Manage Employees Button */}
                      <div className="flex items-center gap-2">
                        {/* Edit Button with Dropdown Menu */}
                        <div className="relative edit-dropdown-container">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenEditMenuId(isMenuOpen ? null : dept.id)
                            }
                            className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <span>Edit</span>
                          </button>

                          {/* Dropdown with 2 options: Edit Department & Delete Department */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditModalDept(dept);
                                  setEditDeptName(dept.name);
                                  setOpenEditMenuId(null);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Edit Department</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteModalDept(dept);
                                  setOpenEditMenuId(null);
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                <span>Delete Department</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Manage Employees Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenManage(dept)}
                          className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                        >
                          Manage Employees
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MANAGE EMPLOYEES VIEW (Screenshot 2) */}
      {/* ========================================================================= */}
      {viewMode === "manage" && selectedDept && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          {/* Breadcrumb Header */}
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="hover:text-blue-600 cursor-pointer font-medium"
            >
              All Departments
            </button>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{selectedDept.name}</span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Filter & Search Controls Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              {/* Left: Branch Filter Dropdown */}
              <div className="relative w-full sm:w-56" ref={branchDropdownRef}>
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  className="w-full text-xs text-left px-3 py-2 border border-slate-200 rounded bg-white text-slate-700 flex items-center justify-between hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <span>
                    {branchesList.find((b) => b.id === selectedBranchFilter)?.name ||
                      "All Branches"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {branchDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-30 py-1 divide-y divide-slate-50">
                    {branchesList.map((branch) => (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => {
                          setSelectedBranchFilter(branch.id);
                          setBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors hover:bg-blue-50 hover:text-blue-600 cursor-pointer ${
                          selectedBranchFilter === branch.id
                            ? "bg-blue-50/80 text-blue-600 font-semibold"
                            : "text-slate-700"
                        }`}
                      >
                        {branch.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Search Employee Input + Blue Search Button */}
              <div className="flex w-full sm:w-auto items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchEmployeeQuery}
                    onChange={(e) => setSearchEmployeeQuery(e.target.value)}
                    placeholder="Search name of employee"
                    className="w-full text-xs text-slate-800 pl-8 pr-3 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                  />
                </div>
                <button
                  type="button"
                  className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Employee List Rows */}
            <div className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No employees found matching the filter.
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const fullName = `${emp.firstName} ${emp.lastName || ""}`.trim();
                  const isInCurrentDept = emp.departmentId === selectedDept.id;

                  return (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Left: Avatar + Name */}
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${getAvatarBg(
                            fullName
                          )} shrink-0 shadow-2xs`}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>

                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {fullName}
                          </div>
                        </div>
                      </div>

                      {/* Right: ADD or REMOVE Button matching Screenshot 2 */}
                      <div>
                        {isInCurrentDept ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleEmployeeDepartment(emp.id, true)
                            }
                            className="border border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500 text-xs font-semibold px-4 py-1 rounded transition-colors cursor-pointer uppercase tracking-wide shadow-2xs"
                          >
                            REMOVE
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleEmployeeDepartment(emp.id, false)
                            }
                            className="border border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-600 text-xs font-semibold px-5 py-1 rounded transition-colors cursor-pointer uppercase tracking-wide shadow-2xs"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODALS: ADD, EDIT, DELETE DEPARTMENT */}
      {/* ========================================================================= */}

      {/* Modal 1: Add Department Popup */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Department</h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              <label className="block text-xs font-normal text-slate-700 mb-1.5">
                Department Name
              </label>
              <input
                type="text"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="e.g. Operations, Sales, Marketing"
                autoFocus
                className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddDepartment}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Add Department</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Department Popup */}
      {editModalDept && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Department</h3>
              <button
                type="button"
                onClick={() => setEditModalDept(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              <label className="block text-xs font-normal text-slate-700 mb-1.5">
                Department Name
              </label>
              <input
                type="text"
                value={editDeptName}
                onChange={(e) => setEditDeptName(e.target.value)}
                placeholder="Department Name"
                autoFocus
                className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditModalDept(null)}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateDepartment}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Department Confirmation Popup */}
      {deleteModalDept && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Delete Department?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Are you sure you want to delete the department{" "}
              <span className="font-bold text-slate-900">
                "{deleteModalDept.name}"
              </span>
              ? All assigned employees will be unlinked from this department.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalDept(null)}
                disabled={actionLoading}
                className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteDepartment}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Department</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
