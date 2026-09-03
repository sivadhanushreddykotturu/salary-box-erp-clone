"use client";

import React, { useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Banknote, FileText, Download, CheckCircle, Calculator } from "lucide-react";

export default function PayrollPage() {
  const [month, setMonth] = useState("9");
  const [year, setYear] = useState("2026");
  const [isCalculated, setIsCalculated] = useState(true);

  const payrollSummary = {
    totalEmployees: 13,
    grossPay: 485000,
    deductions: 38200,
    netPay: 446800,
  };

  const sampleItems = [
    { name: "Anil", basic: 17500, hra: 8750, pf: 2100, pt: 200, net: 29850 },
    { name: "Bobba Prasad", basic: 14000, hra: 7000, pf: 1680, pt: 200, net: 24320 },
    { name: "DARA DEEKSHITH", basic: 16000, hra: 8000, pf: 1920, pt: 200, net: 27880 },
    { name: "Durga Prasad Cargo CUG", basic: 20000, hra: 10000, pf: 2400, pt: 200, net: 34900 },
  ];

  return (
    <AdminShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
          <div>
            <h1 className="text-base font-bold text-slate-800">Payroll Processing Center</h1>
            <p className="text-xs text-slate-500">Automated gross-to-net calculation with statutory PF, ESI, PT compliance</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="8">August</option>
              <option value="9">September</option>
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
            >
              <option value="2026">2026</option>
            </select>

            <button
              onClick={() => alert("Payroll recalculated!")}
              className="flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Run Payroll</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Total Monthly Gross</div>
            <div className="text-xl font-bold text-slate-800 mt-1">
              ₹{payrollSummary.grossPay.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">For {payrollSummary.totalEmployees} employees</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Total Statutory Deductions</div>
            <div className="text-xl font-bold text-rose-600 mt-1">
              ₹{payrollSummary.deductions.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">PF, ESI, PT & TDS</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500">Total Net Salary Payable</div>
            <div className="text-xl font-bold text-[#007BFF] mt-1">
              ₹{payrollSummary.netPay.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for Bank Transfer Export</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Payroll Breakdown (September 2026)</span>
            <button
              onClick={() => alert("Bank CMS Excel sheet downloaded!")}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bank Sheet</span>
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Basic Pay</th>
                <th className="px-4 py-3">HRA</th>
                <th className="px-4 py-3">PF (12%)</th>
                <th className="px-4 py-3">PT</th>
                <th className="px-4 py-3 font-bold text-slate-800">Net Payable</th>
                <th className="px-4 py-3">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sampleItems.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-blue-600">{item.name}</td>
                  <td className="px-4 py-3 text-slate-700">₹{item.basic.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-slate-700">₹{item.hra.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-rose-600">₹{item.pf}</td>
                  <td className="px-4 py-3 text-rose-600">₹{item.pt}</td>
                  <td className="px-4 py-3 font-bold text-slate-900">₹{item.net.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => alert(`Viewing payslip for ${item.name}`)}
                      className="inline-flex items-center gap-1 text-[#007BFF] font-medium hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}