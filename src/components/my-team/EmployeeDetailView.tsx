"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  MoreVertical,
  ChevronRight,
  Plus,
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
  ChevronDown
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
            onClick={onBack}
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
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "Approval Flows") {
                    setApprovalSubView("list");
                  }
                }}
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

          {/* Other Tabs Placeholder */}
          {activeTab !== "Personal Details" &&
            activeTab !== "Employment Details" &&
            activeTab !== "Custom Details" &&
            activeTab !== "Background Verification" &&
            activeTab !== "Bank Account" &&
            activeTab !== "Approval Flows" && (
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
    </div>
  );
}
