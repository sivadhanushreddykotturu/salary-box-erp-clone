"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gem,
  Info,
  FileText,
  Fingerprint,
  Edit3,
  X,
  Check,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowRight
} from "lucide-react";

export function BillingView() {
  const [activeModal, setActiveModal] = useState<
    null | "upgradePlan" | "planDetails" | "viewInvoices" | "buyBiometric" | "editBilling"
  >(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Billing Details State
  const [billingForm, setBillingForm] = useState({
    businessName: "RSS LOGISTICS PRIVATE LIMITED",
    gstin: "37AAAAA0000A1Z5",
    billingEmail: "finance@rsslogistics.in",
    phone: "+91 98765 43210",
    address: "Auto Nagar, Industrial Area, Plot No. 42",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    pincode: "520007",
  });

  // Upgrade Plan Billing Cycle
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("YEARLY");

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      description: "Essential attendance tracking & employee register for small teams",
      priceMonthly: 499,
      priceYearly: 4999,
      maxStaff: "Up to 15 Employees",
      features: ["GPS Geofence Attendance", "Selfie Punch", "Staff Directory", "Basic Reports"],
      current: false,
    },
    {
      id: "growth",
      name: "Growth Plan",
      description: "Complete payroll automation and multi-level leave approvals",
      priceMonthly: 1199,
      priceYearly: 11999,
      maxStaff: "Up to 50 Employees",
      features: ["Everything in Starter", "1-Click Gross-to-Net Payroll", "PF & ESI Compliance", "Leave Approvals"],
      popular: true,
      current: false,
    },
    {
      id: "scale",
      name: "Scale Enterprise",
      description: "Unlimited power for multi-branch, high-growth operations",
      priceMonthly: 1999,
      priceYearly: 19999,
      maxStaff: "Unlimited Employees",
      features: ["Everything in Growth", "CRM Deal Pipeline", "Decentro KYC Verification", "Night Shifts & Rosters", "Dedicated Account Manager"],
      current: true,
    },
  ];

  const invoices = [
    { id: "INV-2026-001", date: "01 Sep 2026", amount: 19999, plan: "Scale Enterprise (Yearly)", status: "PAID", method: "Cashfree UPI / NetBanking" },
    { id: "INV-2025-089", date: "01 Sep 2025", amount: 19999, plan: "Scale Enterprise (Yearly)", status: "PAID", method: "Cashfree Cards" },
    { id: "INV-2024-041", date: "01 Sep 2024", amount: 11999, plan: "Growth Plan (Yearly)", status: "PAID", method: "Cashfree NetBanking" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. SUBSCRIPTIONS */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          SUBSCRIPTIONS
        </h2>

        <div className="space-y-3">
          {/* Card 1: Upgrade Plan */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs px-6 py-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Upgrade Plan</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modify your plan, users, or billing cycle
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal("upgradePlan")}
              className="border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              Upgrade Plan
            </button>
          </div>

          {/* Card 2: Check Plan Details */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs px-6 py-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Check Plan Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View your current plan and features
                </p>
              </div>
            </div>
            <Link
              href="/current-plan-details"
              className="border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              View Details
            </Link>
          </div>

          {/* Card 3: View Invoices */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs px-6 py-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">View Invoices</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View past payments and download invoices
                </p>
              </div>
            </div>
            <Link
              href="/plan-history"
              className="border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              View Invoices
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. BIOMETRIC DEVICES */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          BIOMETRIC DEVICES
        </h2>

        <div className="space-y-3">
          {/* Card 1: Buy Biometric Device */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs px-6 py-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Buy Biometric Device</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Purchase biometric devices for attendance
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal("buyBiometric")}
              className="border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BILLING DETAILS */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          BILLING DETAILS
        </h2>

        <div className="space-y-3">
          {/* Card 1: Edit Billing Details */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs px-6 py-4 flex items-center justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5FF] text-[#007BFF] flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Edit Billing Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your invoice preferences and billing details.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveModal("editBilling")}
              className="border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 px-4 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              Edit Details
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* 1. Upgrade Plan Modal */}
      {activeModal === "upgradePlan" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upgrade / Change Plan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose the right plan tailored to your business scale</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Billing Cycle Selector */}
              <div className="flex justify-center">
                <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setBillingCycle("MONTHLY")}
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      billingCycle === "MONTHLY" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    onClick={() => setBillingCycle("YEARLY")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      billingCycle === "YEARLY" ? "bg-[#007BFF] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>Annual Billing (Save 20%)</span>
                    <span className="bg-emerald-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => {
                  const price = billingCycle === "YEARLY" ? p.priceYearly : p.priceMonthly;
                  const isCurrent = p.current;

                  return (
                    <div
                      key={p.id}
                      className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-all relative ${
                        p.popular
                          ? "border-[#007BFF] ring-2 ring-blue-100 shadow-md"
                          : isCurrent
                          ? "border-emerald-300 ring-2 ring-emerald-50 shadow-xs"
                          : "border-slate-200 shadow-xs hover:border-slate-300"
                      }`}
                    >
                      {p.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#007BFF] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          Most Popular
                        </div>
                      )}

                      {isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          Current Plan
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 min-h-[30px]">{p.description}</p>
                        </div>

                        <div className="border-y border-slate-100 py-2.5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-slate-900">₹{price.toLocaleString("en-IN")}</span>
                            <span className="text-xs text-slate-500">/{billingCycle === "YEARLY" ? "year" : "mo"}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {p.maxStaff}
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {p.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-600">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        {isCurrent ? (
                          <div className="w-full py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg">
                            Active Plan
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              showToast(`Switching to ${p.name}... Redirecting to Cashfree checkout.`);
                              setActiveModal(null);
                            }}
                            className="w-full py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-blue-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            Switch to {p.name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Check Plan Details Modal */}
      {activeModal === "planDetails" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Plan Overview</h3>
                  <p className="text-[11px] text-slate-500">Active subscription details</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-[#FAFBFD] p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Plan Name:</span>
                  <span className="font-bold text-slate-900 text-sm">Scale Enterprise (Unlimited)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Company Code:</span>
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded">IDGWDA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Staff Limit:</span>
                  <span className="font-semibold text-emerald-600">Unlimited Active Employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Multi-Branch Limit:</span>
                  <span className="font-semibold text-emerald-600">Unlimited Branches</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Billing Cycle:</span>
                  <span className="font-semibold text-slate-800">Annual (Auto-renews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Expires On:</span>
                  <span className="font-semibold text-slate-800">01 September 2027</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-2">Enabled Modules:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    "AI Face Recognition & GPS Geofence",
                    "Automated Gross-to-Net Payroll",
                    "Statutory PF / ESI / PT Filing",
                    "Decentro KYC Penny Drop & PAN",
                    "Full CRM Leads & Accounts",
                    "Multi-tier Leave & Claims Approval",
                    "Night Shifts & Custom Rosters",
                    "Scheduled AWS S3 Report Exports",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. View Invoices Modal */}
      {activeModal === "viewInvoices" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Payment Invoices & Receipts</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="px-3 py-2.5">INVOICE</th>
                    <th className="px-3 py-2.5">DATE</th>
                    <th className="px-3 py-2.5">PLAN</th>
                    <th className="px-3 py-2.5">AMOUNT</th>
                    <th className="px-3 py-2.5">STATUS</th>
                    <th className="px-3 py-2.5 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-3 py-3 font-bold text-slate-900">{inv.id}</td>
                      <td className="px-3 py-3 text-slate-600">{inv.date}</td>
                      <td className="px-3 py-3">{inv.plan}</td>
                      <td className="px-3 py-3 font-bold text-slate-900">₹{inv.amount.toLocaleString("en-IN")}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => showToast(`Downloaded invoice ${inv.id}.pdf`)}
                          className="inline-flex items-center gap-1 text-[#007BFF] font-semibold hover:underline cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Buy Biometric Device Modal */}
      {activeModal === "buyBiometric" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Purchase Biometric Machine</h3>
                  <p className="text-[11px] text-slate-500">Plug & Play hardware integrated with SalaryBox Cloud</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                <div className="w-16 h-20 bg-white border border-slate-300 rounded-lg flex flex-col items-center justify-center shadow-xs text-slate-400 shrink-0">
                  <Fingerprint className="w-8 h-8 text-blue-600 mb-1" />
                  <span className="text-[9px] font-bold text-slate-700">BioSync Pro</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">SalaryBox BioSync Pro Terminal</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dual AI Face + Fingerprint sensor with 4G SIM slot, WiFi, and real-time cloud attendance sync.
                  </p>
                  <div className="text-base font-extrabold text-blue-600 mt-2">
                    ₹7,999 <span className="text-xs text-slate-400 font-normal">incl. GST & Free Delivery</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shipping Address</label>
                <textarea
                  rows={2}
                  defaultValue="RSS LOGISTICS, Auto Nagar, Industrial Estate, Vijayawada - 520007"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Includes 1 Year Replacement Warranty & Dedicated Technical Setup</span>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("Device order request submitted! Our hardware specialist will dispatch your device.");
                  setActiveModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Confirm Order (₹7,999)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Edit Billing Details Modal */}
      {activeModal === "editBilling" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <h3 className="text-sm font-bold text-slate-900">Edit Billing Details & Preferences</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Business Name (for GST Invoice)</label>
                <input
                  type="text"
                  value={billingForm.businessName}
                  onChange={(e) => setBillingForm({ ...billingForm, businessName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={billingForm.gstin}
                  onChange={(e) => setBillingForm({ ...billingForm, gstin: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing / Finance Email</label>
                  <input
                    type="email"
                    value={billingForm.billingEmail}
                    onChange={(e) => setBillingForm({ ...billingForm, billingEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Street Address</label>
                <input
                  type="text"
                  value={billingForm.address}
                  onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={billingForm.city}
                    onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={billingForm.state}
                    onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={billingForm.pincode}
                    onChange={(e) => setBillingForm({ ...billingForm, pincode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast("Billing preferences saved successfully!");
                  setActiveModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}