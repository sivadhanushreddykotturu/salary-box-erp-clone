"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

interface CustomFieldItem {
  id: string;
  name: string;
  createdAt?: string;
}

export function CustomFieldsView() {
  const router = useRouter();

  const [customFields, setCustomFields] = useState<CustomFieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<CustomFieldItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch Custom Fields from API
  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/settings/custom-fields");
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data)) {
          setCustomFields(json.data);
        } else {
          setCustomFields([]);
        }
      } else {
        setCustomFields([]);
      }
    } catch (err) {
      console.error("Failed to load custom fields:", err);
      setCustomFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, []);

  // Open & Close Modal
  const handleOpenModal = () => {
    setFieldName("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFieldName("");
  };

  // Submit Add Custom Field
  const handleAddCustomField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) {
      showToast("Please enter a custom field name", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/settings/custom-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fieldName.trim() }),
      });

      if (res.ok) {
        showToast("Custom field added successfully");
        handleCloseModal();
        fetchCustomFields();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson?.message || "Failed to add custom field", "error");
      }
    } catch (err) {
      console.error("Error creating custom field:", err);
      showToast("Network error while adding custom field", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete Custom Field
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/settings/custom-fields/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Custom field removed successfully");
        setDeleteTarget(null);
        fetchCustomFields();
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson?.message || "Failed to remove custom field", "error");
      }
    } catch (err) {
      console.error("Error deleting custom field:", err);
      showToast("Network error while deleting custom field", "error");
    } finally {
      setDeleting(false);
    }
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
          <h1 className="text-sm font-semibold text-slate-900">Custom Fields</h1>
        </div>

        {customFields.length > 0 && (
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-medium px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Field</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span>Loading custom fields...</span>
          </div>
        ) : customFields.length === 0 ? (
          /* Empty State matching Screenshot 1 */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <h2 className="text-sm md:text-base font-bold text-slate-800 mb-1">
              No Custom Field added
            </h2>
            <p className="text-xs text-slate-500 mb-6 max-w-md leading-relaxed">
              Add Custom Fields to store employee data like laptop number, badge number etc.
            </p>

            <button
              type="button"
              onClick={handleOpenModal}
              className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Field</span>
            </button>
          </div>
        ) : (
          /* List of Custom Fields */
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Configured Custom Fields ({customFields.length})
              </span>
            </div>

            {customFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{field.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Available in employee profile cards & forms
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(field)}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                  title="Delete Custom Field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADD CUSTOM FIELD MODAL matching Screenshot 2              */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Custom Field</h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-5 h-5 rounded-full bg-slate-400 hover:bg-slate-500 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleAddCustomField} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Custom Field Name
                </label>
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="Eg: - Laptop Number, Badge Number etc."
                  required
                  autoFocus
                  className="w-full text-xs text-slate-800 px-3.5 py-2.5 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>

              {/* Modal Footer matching Screenshot 2 */}
              <div className="flex items-center justify-center sm:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !fieldName.trim()}
                  className={`px-5 py-2 text-xs font-medium rounded transition-colors flex items-center gap-1.5 shadow-sm ${
                    fieldName.trim()
                      ? "bg-[#1877F2] hover:bg-[#166FE5] text-white cursor-pointer"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Add Custom Field</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Delete Custom Field</h3>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.name}</strong>? Existing values on employee profiles will no longer be visible.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
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
