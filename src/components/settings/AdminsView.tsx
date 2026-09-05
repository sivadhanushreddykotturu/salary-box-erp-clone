"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  X,
  User,
  Phone,
  Mail,
} from "lucide-react";

interface AdminItem {
  id: string;
  employeeId?: string | null;
  name: string;
  initials: string;
  phone: string;
  rawPhone: string;
  email?: string;
  role?: string;
  userRole?: string;
}

export function AdminsView() {
  const router = useRouter();

  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Modal State
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminItem | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Delete confirmation modal
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admins");
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setAdmins(json.data);
        }
      } else {
        // Fallback default
        setAdmins([
          {
            id: "owner-default",
            name: "PAPPU SRINIVASA PRABHAKAR RAO",
            initials: "PR",
            phone: "+919542843456",
            rawPhone: "9542843456",
            email: "admin@rsslogistics.in",
            role: "COMPANY_OWNER",
            userRole: "Company Owner",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setAdmins([
        {
          id: "owner-default",
          name: "PAPPU SRINIVASA PRABHAKAR RAO",
          initials: "PR",
          phone: "+919542843456",
          rawPhone: "9542843456",
          email: "admin@rsslogistics.in",
          role: "COMPANY_OWNER",
          userRole: "Company Owner",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Open Add Admin Modal
  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedAdmin(null);
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setPhoneError(null);
  };

  // Open Edit Admin Modal
  const handleOpenEdit = (admin: AdminItem) => {
    setModalMode("edit");
    setSelectedAdmin(admin);
    setFormName(admin.name);
    setFormPhone(admin.rawPhone || admin.phone.replace("+91", ""));
    setFormEmail(admin.email || "");
    setPhoneError(null);
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedAdmin(null);
    setPhoneError(null);
  };

  // Phone input formatting & validation
  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setFormPhone(clean);
    if (clean.length > 0 && clean.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError(null);
    }
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      showToast("Please enter admin name", "error");
      return;
    }

    if (!formPhone || formPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/v1/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            phone: formPhone,
            email: formEmail.trim() || undefined,
          }),
        });

        if (res.ok) {
          showToast("Admin added successfully");
          handleCloseModal();
          fetchAdmins();
        } else {
          const errJson = await res.json().catch(() => ({}));
          showToast(errJson?.message || "Failed to add admin", "error");
        }
      } else if (modalMode === "edit" && selectedAdmin) {
        const res = await fetch(`/api/v1/admins/${selectedAdmin.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            phone: formPhone,
            email: formEmail.trim(),
          }),
        });

        if (res.ok) {
          showToast("Admin updated successfully");
          handleCloseModal();
          fetchAdmins();
        } else {
          const errJson = await res.json().catch(() => ({}));
          showToast(errJson?.message || "Failed to update admin", "error");
        }
      }
    } catch (err) {
      console.error("Error saving admin:", err);
      showToast("Network error while saving admin", "error");
    } finally {
      setSaving(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteAdminTarget) return;

    if (admins.length <= 1) {
      showToast("Cannot delete the only remaining admin of the company", "error");
      setDeleteAdminTarget(null);
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/admins/${deleteAdminTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Admin removed successfully");
        setDeleteAdminTarget(null);
        fetchAdmins();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson?.message || "Failed to delete admin", "error");
      }
    } catch (err) {
      console.error("Error deleting admin:", err);
      showToast("Network error while deleting admin", "error");
    } finally {
      setDeleting(false);
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

      {/* Top Header Back Navigation matching Screenshot */}
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
          <h1 className="text-sm font-semibold text-slate-900">Admins</h1>
        </div>

        {saving && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Bar: "Admins" on left, "+ Add Admin" blue button on right */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-slate-900">Admins</h2>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>

        {/* Admins Listing Card */}
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading admins...</span>
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-12 text-center text-xs text-slate-500">
            No admins configured yet. Click "Add Admin" above.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Left: Avatar Initials + Admin Details */}
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#E2E8F0] text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 shadow-inner">
                    {admin.initials || "PR"}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                      {admin.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      {admin.phone}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* EDIT Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(admin)}
                    className="border border-[#1877F2] text-[#1877F2] hover:bg-blue-50 active:bg-blue-100 text-xs font-semibold px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>EDIT</span>
                  </button>

                  {/* DELETE Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteAdminTarget(admin)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                    title="Delete Admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT ADMIN INFO MODAL                                */}
      {/* ========================================================= */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {modalMode === "add" ? "Add Admin" : "Admin Info"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name"
                    required
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white uppercase"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-medium text-slate-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                    className={`w-full text-xs text-slate-800 pl-11 pr-3.5 py-2.5 border rounded focus:ring-1 outline-none transition-all placeholder:text-slate-400 bg-white ${
                      phoneError
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="admin@rsslogistics.in"
                    className="w-full text-xs text-slate-800 px-3.5 py-2.5 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-5 py-2 rounded transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL                                  */}
      {/* ========================================================= */}
      {deleteAdminTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Delete Admin</h3>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="text-slate-900">{deleteAdminTarget.name}</strong> as an
              administrator? They will lose access to company settings and administrative actions.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteAdminTarget(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
