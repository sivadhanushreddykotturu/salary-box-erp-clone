"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Download,
  Check,
  FileText
} from "lucide-react";

interface PlanHistoryItem {
  id: string;
  date: string;
  typeOfPlan: "Plan Upgrade" | "Renewal" | "New Plan";
  details: string;
  invoiceNumber: string;
}

const HISTORY_ITEMS: PlanHistoryItem[] = [
  {
    id: "1",
    date: "13 Aug 2026",
    typeOfPlan: "Plan Upgrade",
    details: "Plan: Business x 10 users. Valid till 2026-11-11",
    invoiceNumber: "INV-2026-0813",
  },
  {
    id: "2",
    date: "11 Aug 2026",
    typeOfPlan: "Renewal",
    details: "Plan: Starter x 10 users. Valid till 2026-11-11",
    invoiceNumber: "INV-2026-0811",
  },
  {
    id: "3",
    date: "06 Jun 2026",
    typeOfPlan: "Plan Upgrade",
    details: "Plan: Business x 12 users + Live Location Tracking x 8 users. Valid till 2026-08-08",
    invoiceNumber: "INV-2026-0606-B",
  },
  {
    id: "4",
    date: "06 Jun 2026",
    typeOfPlan: "Plan Upgrade",
    details: "Plan: Business x 11 users + Live Location Tracking x 8 users. Valid till 2026-08-08",
    invoiceNumber: "INV-2026-0606-A",
  },
  {
    id: "5",
    date: "14 May 2026",
    typeOfPlan: "Plan Upgrade",
    details: "Plan: Business x 10 users + Live Location Tracking x 8 users. Valid till 2026-08-08",
    invoiceNumber: "INV-2026-0514",
  },
  {
    id: "6",
    date: "08 May 2026",
    typeOfPlan: "Plan Upgrade",
    details: "Plan: Business x 9 users + Live Location Tracking x 8 users. Valid till 2026-08-08",
    invoiceNumber: "INV-2026-0508-B",
  },
  {
    id: "7",
    date: "08 May 2026",
    typeOfPlan: "New Plan",
    details: "Plan: Business x 9 users. Valid till 2026-08-08",
    invoiceNumber: "INV-2026-0508-A",
  },
];

export function PlanHistoryView() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadInvoice = (item: PlanHistoryItem) => {
    // Generate simulated CSV / PDF receipt download
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `Invoice Number,Date,Type,Details,Amount,Status\n` +
      `"${item.invoiceNumber}","${item.date}","${item.typeOfPlan}","${item.details}","INR 19,999","PAID"\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SalaryBox_${item.invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloading invoice ${item.invoiceNumber}...`);
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
        <h1 className="text-sm md:text-base font-bold text-slate-900">Plan History</h1>
      </div>

      {/* Yellow Store Warning Alert */}
      <div className="bg-[#FFFDF0] border border-[#FDE68A] rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          If you purchased a plan through the Apple App Store or Google Play Store, your invoice will be available directly from that store.
        </span>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                <th className="px-6 py-4 w-36">Date</th>
                <th className="px-6 py-4 w-44">Type Of Plan</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 w-32 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {HISTORY_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 text-slate-800 whitespace-nowrap font-medium">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-slate-800 whitespace-nowrap font-medium">
                    {item.typeOfPlan}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {item.details}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#007BFF] text-[#007BFF] hover:bg-blue-50 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
