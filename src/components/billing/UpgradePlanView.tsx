"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Check,
  X,
  Ticket,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2
} from "lucide-react";

export function UpgradePlanView() {
  const router = useRouter();

  // State
  const [billingPeriod, setBillingPeriod] = useState<"quarterly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<"Starter" | "Business">("Business");
  const [userCount, setUserCount] = useState<number>(10);
  const [currentUsers] = useState<number>(10);
  const [currentPlan] = useState<"Starter" | "Business">("Business");
  const [currentPeriod] = useState<"quarterly" | "annual">("quarterly");

  // Add-ons state
  const [selectedAddons, setSelectedAddons] = useState<{
    liveLocation: boolean;
    fieldForceCRM: boolean;
  }>({
    liveLocation: false,
    fieldForceCRM: false,
  });

  const [expandedAddonDetails, setExpandedAddonDetails] = useState<"liveLocation" | "fieldForceCRM" | null>("liveLocation");

  // Modal State
  const [isSelectPlanModalOpen, setIsSelectPlanModalOpen] = useState(false);
  const [tempSelectedPlan, setTempSelectedPlan] = useState<"Starter" | "Business">("Business");
  const [expandedPlanDetails, setExpandedPlanDetails] = useState<"Starter" | "Business" | null>("Business");

  // Next renewal accordion
  const [isRenewalExpanded, setIsRenewalExpanded] = useState<boolean>(false);

  // Coupon & Toast
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isAddonsModalOpen, setIsAddonsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pricing Model
  const isAnnual = billingPeriod === "annual";
  const isBusiness = selectedPlan === "Business";

  // Base plan amounts
  const basePlanGrossAnnual = isBusiness ? 36000 : 18000;
  const userRateAnnual = isBusiness ? 900 : 360; // 900 per user per year for business
  const userChargeGrossAnnual = userCount * userRateAnnual;

  // Quarterly rates
  const baseMonthlyRate = isBusiness ? 2700 : 1350;
  const userMonthlyRate = isBusiness ? 67.5 : 27;

  // Add-ons cost
  const addonMonthlyCost = (selectedAddons.liveLocation ? 90 : 0) + (selectedAddons.fieldForceCRM ? 225 : 0);
  const addonTotalCost = isAnnual ? addonMonthlyCost * 12 : addonMonthlyCost * 3;

  // Adjustment credit from existing plan
  const remainingPlanAdjustment = 7483.75;

  // Annual discount calculation (Exact: -₹15,000 for 10 users, -₹14,700 for 9 users)
  // Discount is: Base discount (12,000) + (userCount * 300) = 15,000 for 10 users, 14,700 for 9 users
  const annualDiscountAmount = isAnnual ? 12000 + (userCount * 300) : 0;

  // Subtotal & Calculations
  let subtotal = 0;
  let isAlreadyPaidDueNow = false;

  if (isAnnual) {
    // When annual is selected
    const totalGross = basePlanGrossAnnual + userChargeGrossAnnual + addonTotalCost;
    const netBeforeAdjustment = totalGross - annualDiscountAmount;
    subtotal = Math.max(0, netBeforeAdjustment - remainingPlanAdjustment);
  } else {
    // When quarterly is selected
    if (userCount <= currentUsers && selectedPlan === currentPlan) {
      isAlreadyPaidDueNow = true;
      subtotal = 0 + addonTotalCost;
    } else {
      const extraUsers = Math.max(0, userCount - currentUsers);
      const extraUserCharge = extraUsers * userMonthlyRate * 3 * 0.9; // 10% off
      subtotal = Math.round(extraUserCharge + addonTotalCost);
    }
  }

  // Taxes (GST 18%)
  const gstRate = 0.18;
  const gstAmount = subtotal > 0 ? Number((subtotal * gstRate).toFixed(2)) : 0;
  const youPay = Number((subtotal + gstAmount - appliedDiscount).toFixed(2));

  // Next Renewal Calculations
  // In Screenshot 2 & 3: Annual renewal shows ₹2,500/mo for 10 users (Business plan ₹2,000/mo, User charge ₹500/mo)
  // For 9 users: ₹2,450/mo (Business plan ₹2,000/mo, User charge ₹450/mo => 50/user/mo)
  // For Quarterly 9 users (Screenshot 4): ₹3,307.50/mo (Business plan ₹2,700/mo, User charge ₹607.50/mo => 67.50/user/mo)
  const renewalBaseMonthly = isAnnual ? 2000 : baseMonthlyRate;
  const renewalUserMonthlyRate = isAnnual ? (isBusiness ? 50 : 20) : userMonthlyRate;
  const renewalUserChargeMonthly = userCount * renewalUserMonthlyRate;
  const nextRenewalMonthlyTotal = renewalBaseMonthly + renewalUserChargeMonthly + addonMonthlyCost;
  const renewalDate = isAnnual ? "5 Sept 2027" : "11 Nov 2026";

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE20") {
      setAppliedDiscount(Math.round(subtotal * 0.2));
      showToast("Coupon SAVE20 applied! 20% discount granted.");
      setIsCouponModalOpen(false);
    } else if (couponCode.trim()) {
      setAppliedDiscount(500);
      showToast(`Coupon ${couponCode.toUpperCase()} applied! ₹500 discount.`);
      setIsCouponModalOpen(false);
    }
  };

  const handleConfirmPlanChange = () => {
    setSelectedPlan(tempSelectedPlan);
    setIsSelectPlanModalOpen(false);
    showToast(`Switched plan to ${tempSelectedPlan}`);
  };

  const handleOpenPlanModal = () => {
    setTempSelectedPlan(selectedPlan);
    setExpandedPlanDetails(selectedPlan);
    setIsSelectPlanModalOpen(true);
  };

  const togglePlanAccordion = (plan: "Starter" | "Business") => {
    setExpandedPlanDetails(expandedPlanDetails === plan ? null : plan);
  };

  const toggleAddonAccordion = (addon: "liveLocation" | "fieldForceCRM") => {
    setExpandedAddonDetails(expandedAddonDetails === addon ? null : addon);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
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
          className="p-1 rounded-md hover:bg-slate-200/60 text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-sm md:text-base font-bold text-slate-900">Upgrade Plan</h1>
      </div>

      {/* Main Grid: 2 Columns (Left Config + Right Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Validity Banner */}
          <div className="bg-[#EBF5FF] border border-blue-100 rounded-lg px-4 py-3 text-xs text-slate-800 font-medium">
            Current plan valid till <strong className="text-slate-900 font-bold">11 Nov 2026</strong>
          </div>

          {/* 1. Billing Period Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
            <h2 className="text-xs font-bold text-slate-900">Billing Period</h2>

            <div className="grid grid-cols-2 gap-3 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setBillingPeriod("quarterly")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingPeriod === "quarterly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Quarterly</span>
                <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  10% off
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingPeriod("annual")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingPeriod === "annual"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual</span>
                <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  33% off
                </span>
              </button>
            </div>
          </div>

          {/* 2. Plan & Users Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs divide-y divide-slate-100 space-y-4">
            {/* Plan Row */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-800">Plan</span>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-900">{selectedPlan}</span>
                <button
                  type="button"
                  onClick={handleOpenPlanModal}
                  className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline-offset-2 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Users Row */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Users</span>
                <span className="text-[11px] text-slate-400">Currently {currentUsers} users</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={userCount}
                  onChange={(e) => setUserCount(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center text-xs font-bold px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <span className="text-xs text-slate-500 font-medium">users</span>
              </div>
            </div>
          </div>

          {/* 3. Add-ons Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Add-ons</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedAddons.liveLocation || selectedAddons.fieldForceCRM
                  ? `${[selectedAddons.liveLocation && "Live Location Tracking", selectedAddons.fieldForceCRM && "Field Force CRM"].filter(Boolean).join(", ")} selected`
                  : "Optional extras for your team"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddonsModalOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="pt-1">
            <span className="text-[11px] text-slate-400">
              See full plan comparison at{" "}
              <a
                href="https://salarybox.in/pricing"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                salarybox.in/pricing
              </a>
            </span>
          </div>
        </div>

        {/* Right Column: ORDER SUMMARY (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            ORDER SUMMARY
          </h3>

          <div className="space-y-3 pt-1 text-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DUE NOW
            </div>

            {/* Business/Starter plan row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-600">
                <span>{selectedPlan} plan</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-slate-800 font-medium">
                {isAnnual ? `₹${basePlanGrossAnnual.toLocaleString("en-IN")}` : isAlreadyPaidDueNow ? "Already paid" : `₹${baseMonthlyRate * 3}`}
              </span>
            </div>

            {/* User charge row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-600">
                <span>User charge ({userCount} users)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-slate-800 font-medium">
                {isAnnual
                  ? `₹${userChargeGrossAnnual.toLocaleString("en-IN")}`
                  : isAlreadyPaidDueNow
                  ? "Already paid"
                  : `₹${(userCount * userMonthlyRate * 3).toLocaleString("en-IN")}`}
              </span>
            </div>

            {/* Annual Specific Lines */}
            {isAnnual && (
              <>
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1">
                    <span>Remaining Plan Adjustment</span>
                    <Info className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-blue-600 font-medium">-₹{remainingPlanAdjustment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center justify-between text-blue-600">
                  <span>Annual discount (33% off)</span>
                  <span className="font-medium">-₹{annualDiscountAmount.toLocaleString("en-IN")}</span>
                </div>
              </>
            )}

            {/* Selected Addons row if any */}
            {addonTotalCost > 0 && (
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1">
                  <span>Add-ons total</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-slate-800 font-medium">+₹{addonTotalCost.toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* Subtotal */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Coupon discount row */}
            <div className="flex items-center justify-between py-1">
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Coupon discount</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-0.5"
              >
                {appliedDiscount > 0 ? `-₹${appliedDiscount.toLocaleString("en-IN")}` : "Apply now >"}
              </button>
            </div>

            {/* GST */}
            {isAnnual && (
              <div className="flex items-center justify-between text-slate-600">
                <span>GST (18%)</span>
                <span className="font-medium text-slate-800">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* You pay / Due now */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{isAnnual ? "You pay" : "Due now"}</span>
              <span className="text-sm font-black text-slate-900">
                ₹{youPay.toLocaleString("en-IN", { minimumFractionDigits: isAnnual ? 2 : 0, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Savings Banner on Annual */}
            {isAnnual && (
              <div className="bg-[#EBF5FF] text-blue-700 font-semibold text-[11px] p-2.5 rounded-lg">
                You save ₹{annualDiscountAmount.toLocaleString("en-IN")} on this change.
              </div>
            )}

            {/* Notice for Quarterly downgrade or same */}
            {!isAnnual && isAlreadyPaidDueNow && (
              <div className="text-[11px] text-amber-700 font-medium">
                Changes take effect at your next renewal.
              </div>
            )}

            {/* Next Renewal Dropdown Section */}
            <div className="border-t border-slate-100 pt-3">
              <div
                onClick={() => setIsRenewalExpanded(!isRenewalExpanded)}
                className="flex items-center justify-between cursor-pointer group py-1"
              >
                <div className="flex items-center gap-1 text-slate-700">
                  {isRenewalExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">Next Renewal*</div>
                    <div className="text-[11px] text-slate-400">{renewalDate}</div>
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-xs">
                  ₹{nextRenewalMonthlyTotal.toLocaleString("en-IN", { minimumFractionDigits: isAnnual ? 0 : 2, maximumFractionDigits: 2 })}/mo
                </span>
              </div>

              {/* Expanded Breakdown */}
              {isRenewalExpanded && (
                <div className="mt-2 pl-4 pr-1 py-2 space-y-2 bg-slate-50/70 rounded-lg text-[11px] border border-slate-100 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1">
                      <span>{selectedPlan} plan</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-800">
                      ₹{renewalBaseMonthly.toLocaleString("en-IN")}/mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-1">
                      <span>User charge ({userCount} users)</span>
                      <Info className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-800">
                      ₹{renewalUserChargeMonthly.toLocaleString("en-IN", { minimumFractionDigits: isAnnual ? 0 : 2, maximumFractionDigits: 2 })}/mo
                    </span>
                  </div>

                  {addonMonthlyCost > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Add-ons</span>
                      <span className="font-medium text-slate-800">₹{addonMonthlyCost.toLocaleString("en-IN")}/mo</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200/80 pt-1.5 flex items-center justify-between font-bold text-slate-900">
                    <span>Renewal subtotal</span>
                    <span>
                      ₹{nextRenewalMonthlyTotal.toLocaleString("en-IN", { minimumFractionDigits: isAnnual ? 0 : 2, maximumFractionDigits: 2 })}/mo
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    showToast(`Order created for ₹${youPay.toLocaleString("en-IN")}. Continuing to payment...`);
                  }, 800);
                }}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-[#0066FF] hover:bg-blue-700 shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Continue</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              *billed {billingPeriod}. Taxes apply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

