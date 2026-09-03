"use client";

import React, { useState } from "react";
import { CreditCard, Check, Zap, Shield, FileText, Download, ArrowRight, ExternalLink } from "lucide-react";

export function BillingView() {
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("YEARLY");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      description: "Essential attendance tracking & employee register for small teams",
      priceMonthly: 499,
      priceYearly: 4999,
      maxStaff: "Up to 15 Employees",
      branches: "1 Branch",
      features: [
        "GPS Geofenced Attendance",
        "Selfie & Smartphone Punch",
        "Staff Master Directory",
        "Basic Daily Attendance Reports",
        "Standard Email Support",
      ],
      current: false,
    },
    {
      id: "growth",
      name: "Growth Plan",
      description: "Complete payroll automation and leave approval workflows",
      priceMonthly: 1199,
      priceYearly: 11999,
      maxStaff: "Up to 50 Employees",
      branches: "5 Branches",
      features: [
        "Everything in Starter",
        "1-Click Automated Gross-to-Net Payroll",
        "Statutory Compliance (PF 12%, ESI 0.75%, PT)",
        "PDF Pay Slip Generator & Employee Portal",
        "Leave & Multi-Tier Approval Flows",
        "Reimbursement & Advance Claims",
      ],
      popular: true,
      current: false,
    },
    {
      id: "scale",
      name: "Scale Enterprise",
      description: "Unlimited power for high-growth logistics, multi-branch, and enterprise businesses",
      priceMonthly: 1999,
      priceYearly: 19999,
      maxStaff: "Unlimited Employees",
      branches: "Unlimited Branches",
      features: [
        "Everything in Growth",
        "Full CRM Deal Pipeline & Client Accounts",
        "Decentro KYC (Aadhaar, PAN, Bank Penny Drop)",
        "Automated Scheduled S3 Report Exports",
        "Priority 24/7 Dedicated Account Manager",
        "Custom Shift Rosters & Night Shifts",
      ],
      current: true,
    },
  ];

  const invoices = [
    { id: "INV-2026-001", date: "01 Sep 2026", amount: 19999, plan: "Scale Enterprise (Yearly)", status: "PAID", method: "Cashfree UPI / NetBanking" },
    { id: "INV-2025-089", date: "01 Sep 2025", amount: 19999, plan: "Scale Enterprise (Yearly)", status: "PAID", method: "Cashfree Cards" },
  ];

  const handlePay = (planId: string) => {
    setIsProcessing(true);
    // Simulates Cashfree Sandbox Checkout
    setTimeout(() => {
      alert("Redirecting to Cashfree Sandbox Checkout...\nOrder ID: CF_ORD_" + Date.now());
      setIsProcessing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-800">Subscriptions & Billing</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Subscription
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Company: <strong className="text-slate-700">RSS LOGISTICS (IDGWDA)</strong> • Current Plan: <strong className="text-[#007BFF]">Scale Enterprise (Unlimited)</strong>
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setBillingCycle("MONTHLY")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              billingCycle === "MONTHLY" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("YEARLY")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              billingCycle === "YEARLY" ? "bg-[#007BFF] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Annual (Save 20%)</span>
            <span className="bg-emerald-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
              PROMO
            </span>
          </button>
        </div>
      </div>

      {/* 2. Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const price = billingCycle === "YEARLY" ? p.priceYearly : p.priceMonthly;
          const isCurrent = p.current;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all relative ${
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
                  Current Active Plan
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>
                </div>

                <div className="border-y border-slate-100 py-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">₹{price.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-500">/{billingCycle === "YEARLY" ? "year" : "month"}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {p.maxStaff} • {p.branches}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Features Included:</div>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                  >
                    ✓ Currently Active
                  </button>
                ) : (
                  <button
                    onClick={() => handlePay(p.id)}
                    disabled={isProcessing}
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#007BFF] hover:bg-blue-600 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    {isProcessing ? "Connecting to Cashfree..." : "Switch to " + p.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Invoices Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">Billing History & GST Invoices</h2>
          </div>
          <span className="text-xs text-slate-400">Automated Cashfree SaaS Receipts</span>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
              <th className="px-4 py-3">INVOICE NO</th>
              <th className="px-4 py-3">DATE</th>
              <th className="px-4 py-3">PLAN</th>
              <th className="px-4 py-3">AMOUNT (INR)</th>
              <th className="px-4 py-3">PAYMENT METHOD</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3 text-right">RECEIPT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-4 py-3.5 font-bold text-slate-900">{inv.id}</td>
                <td className="px-4 py-3.5 text-slate-600">{inv.date}</td>
                <td className="px-4 py-3.5">{inv.plan}</td>
                <td className="px-4 py-3.5 font-bold text-slate-900">₹{inv.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3.5 text-slate-600">{inv.method}</td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => alert(`Downloading Invoice ${inv.id}...`)}
                    className="inline-flex items-center gap-1 text-[#007BFF] font-semibold hover:underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}