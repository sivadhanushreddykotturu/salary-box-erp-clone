"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function EmployeeIdConfigView() {
  const router = useRouter();

  // Form States
  const [autoAssign, setAutoAssign] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [nextNumber, setNextNumber] = useState<number | string>(1);
  const [digitsInNumber, setDigitsInNumber] = useState<number | string>(0);

  // Validation & Loading
  const [digitsError, setDigitsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial config from API
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/v1/settings/employee-id-config");
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setAutoAssign(json.data.autoAssign ?? false);
            setPrefix(json.data.prefix ?? "");
            setNextNumber(json.data.nextNumber ?? 1);
            setDigitsInNumber(json.data.digitsInNumber ?? 0);
          }
        }
      } catch (err) {
        console.error("Failed to load employee ID config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // Handle Digits Change with validation: <= 10
  const handleDigitsChange = (val: string) => {
    if (val === "") {
      setDigitsInNumber("");
      setDigitsError(null);
      return;
    }

    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setDigitsInNumber(0);
      setDigitsError(null);
      return;
    }

    if (num > 10) {
      setDigitsInNumber(num);
      setDigitsError("Digits in number must be less than or equal to 10.");
    } else if (num < 0) {
      setDigitsInNumber(0);
      setDigitsError(null);
    } else {
      setDigitsInNumber(num);
      setDigitsError(null);
    }
  };

  // Generate the next 5 sample IDs
  const computeNext5Ids = () => {
    const startNum = typeof nextNumber === "number" ? nextNumber : parseInt(nextNumber || "1", 10) || 1;
    const padding = typeof digitsInNumber === "number" ? digitsInNumber : parseInt(digitsInNumber || "0", 10) || 0;
    const safePadding = Math.min(10, Math.max(0, padding));

    const ids: string[] = [];
    for (let i = 0; i < 5; i++) {
      const current = startNum + i;
      let numStr = String(current);
      if (safePadding > 0) {
        numStr = numStr.padStart(safePadding, "0");
      }
      ids.push(`${prefix}${numStr}`);
    }
    return ids;
  };

  const previewIds = computeNext5Ids();

  // Save changes
  const handleSaveChanges = async () => {
    const paddingNum = typeof digitsInNumber === "number" ? digitsInNumber : parseInt(digitsInNumber || "0", 10) || 0;
    if (paddingNum > 10) {
      showToast("Digits in number must be less than or equal to 10.", "error");
      return;
    }

    const startNum = typeof nextNumber === "number" ? nextNumber : parseInt(nextNumber || "1", 10) || 1;

    setSaving(true);
    try {
      const res = await fetch("/api/v1/settings/employee-id-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          autoAssign,
          prefix: prefix.trim(),
          nextNumber: startNum,
          digitsInNumber: paddingNum,
        }),
      });

      if (res.ok) {
        showToast("Employee ID configuration saved successfully");
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson?.message || "Failed to save configuration", "error");
      }
    } catch (err) {
      console.error("Error saving employee ID config:", err);
      showToast("Network error saving configuration", "error");
    } finally {
      setSaving(false);
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

      {/* Top Header Back Navigation matching Screenshots */}
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
          <h1 className="text-sm font-semibold text-slate-900">Auto Generate Employee ID</h1>
        </div>

        {saving && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Main Content Area matching Screenshots 1-5 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-900">Auto Generate Employee ID</h2>
          <p className="text-xs text-slate-500 mt-0.5">Changes here only affect new employees.</p>
        </div>

        {/* Configuration Card Box */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Row 1: Auto-assign Employee IDs Toggle Switch */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs font-medium text-slate-900">Auto-assign Employee IDs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                New employees will automatically receive the next available ID
              </div>
            </div>

            {/* Toggle Button */}
            <button
              type="button"
              role="switch"
              aria-checked={autoAssign}
              onClick={() => setAutoAssign(!autoAssign)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                autoAssign ? "bg-[#1877F2]" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  autoAssign ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Row 2: Prefix Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-900">Prefix</label>
              <span className="text-[11px] text-slate-400">Text added before the number</span>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="e.g. EM-"
                className="w-full text-xs text-slate-800 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Row 3: Next number Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-900">Next number</label>
              <span className="text-[11px] text-slate-400">
                Number that will be assigned to the next employee
              </span>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="number"
                value={nextNumber}
                onChange={(e) => setNextNumber(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                min={1}
                className="w-full text-xs text-slate-800 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 4: Digits in number Input */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-900">Digits in number</label>
              <span className="text-[11px] text-slate-400">
                Keep IDs the same length: 1 digit = "5", 2 digits = "05", 3 digits = "005"
              </span>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="number"
                value={digitsInNumber}
                onChange={(e) => handleDigitsChange(e.target.value)}
                min={0}
                max={10}
                className={`w-full text-xs text-slate-800 px-3.5 py-2 bg-slate-50 border rounded focus:bg-white focus:ring-1 outline-none transition-all ${
                  digitsError
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {digitsError && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{digitsError}</span>
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Live 5 IDs Preview Box (Only visible when autoAssign is ON, matching Screenshots 2-5) */}
          {autoAssign && (
            <div className="pt-2">
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
                <div className="text-[11px] text-slate-500 mb-2.5">The next 5 IDs would be:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {previewIds.map((idVal, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 text-slate-800 text-xs px-3.5 py-1.5 rounded shadow-2xs font-normal"
                    >
                      {idVal}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Changes Button matching Screenshots */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={saving || !!digitsError}
              className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-6 py-2 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
