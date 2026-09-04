"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Info,
  Check,
  X,
  AlertTriangle
} from "lucide-react";

export function CurrentPlanDetailsView() {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCanceled, setIsCanceled] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancelSubscription = () => {
    setIsCanceled(true);
    setIsCancelModalOpen(false);
    showToast("Auto-renewal has been cancelled. Plan remains active until 11 Nov 2026.");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Back Arrow */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-md hover:bg-slate-200/60 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-sm md:text-base font-bold text-slate-900">Current Plan Details</h1>
      </div>

      {/* Main Plan Details Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 md:p-8 shadow-xs space-y-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-bold text-slate-900">Business</span>
              <button
                type="button"
                onClick={() => showToast("Business Plan includes Full Attendance, Payroll & CRM Modules")}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Plan information"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Current Plan</span>
          </div>
        </div>

        {/* Key-Value Details */}
        <div className="space-y-4 pt-2">
          {/* Billing Cycle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Billing Cycle</span>
            <span className="font-semibold text-slate-900">Quarterly</span>
          </div>

          {/* User Count */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">User Count</span>
            <span className="font-semibold text-slate-900">10 users</span>
          </div>

          {/* Add-ons */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Add-ons</span>
            <span className="font-semibold text-slate-900">None</span>
          </div>
        </div>

        {/* Footer Row */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-xs text-slate-400 font-normal">
            {isCanceled
              ? "Auto-renewal cancelled (Expires on 11 November 2026)"
              : "Auto-renewal on 11 November 2026"}
          </span>

          {!isCanceled ? (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel subscription
            </button>
          ) : (
            <span className="text-xs text-red-500 font-semibold">Cancelled</span>
          )}
        </div>
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">Cancel Subscription?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel auto-renewal? Your team will continue to have full access to Business features until <strong>11 November 2026</strong>.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                You can re-activate or change your subscription plan anytime before expiry.
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
