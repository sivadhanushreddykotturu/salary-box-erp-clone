"use client";

import React from "react";
import { X, Printer, Download } from "lucide-react";

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipModal({ isOpen, onClose }: PayslipModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Modal Controls */}
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs font-bold text-slate-700">Payslip Preview</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payslip Document Body matching Sample PDF */}
        <div className="p-8 text-slate-800 font-sans text-xs space-y-5 bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-4 border-slate-200">
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900">RSS LOGISTICS</h1>
            </div>
            <div className="bg-[#007BFF] text-white px-2 py-0.5 rounded text-[10px] font-bold">
              RSS LOGISTICS
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Pay Slip for August 2026
            </h2>
          </div>

          {/* Employee Details Section */}
          <div className="border border-slate-300 rounded-sm">
            <div className="bg-slate-50 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-700">
              Employee Details
            </div>
            <div className="p-3 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-slate-500 mr-2">Name:</span>
                <span className="font-bold text-slate-900">Anil</span>
              </div>
              <div>
                <span className="text-slate-500 mr-2">Phone Number:</span>
                <span className="font-mono text-slate-900">9989110795</span>
              </div>
              <div>
                <span className="text-slate-500 mr-2">Salary Amount:</span>
                <span className="font-bold text-slate-900">₹ 18000.00/Month</span>
              </div>
              <div>
                <span className="text-slate-500 mr-2">Branch:</span>
                <span className="text-slate-900 font-medium">Addanki</span>
              </div>
            </div>
          </div>

          {/* Salary Calculations Section */}
          <div className="border border-slate-300 rounded-sm overflow-hidden">
            <div className="bg-slate-50 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-700">
              Salary Calculations
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/60 font-semibold text-[11px] text-slate-600 uppercase">
                  <th className="p-2 border-r border-slate-300 w-1/4">EARNINGS</th>
                  <th className="p-2 border-r border-slate-300 w-1/4">AMOUNT</th>
                  <th className="p-2 border-r border-slate-300 w-1/4">DEDUCTIONS</th>
                  <th className="p-2 w-1/4">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-300">Basic Salary</td>
                  <td className="p-2 border-r border-slate-300 font-mono">₹ 10666.67</td>
                  <td className="p-2 border-r border-slate-300">-</td>
                  <td className="p-2 font-mono">-</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300">Reimbursements</td>
                  <td className="p-2 border-r border-slate-300 font-mono">₹ 2340.0</td>
                  <td className="p-2 border-r border-slate-300">-</td>
                  <td className="p-2 font-mono">-</td>
                </tr>
                <tr className="font-bold bg-slate-50">
                  <td className="p-2 border-r border-slate-300">Total Earnings</td>
                  <td className="p-2 border-r border-slate-300 font-mono text-[#007BFF]">₹ 13006.67</td>
                  <td className="p-2 border-r border-slate-300">Total Deductions</td>
                  <td className="p-2 font-mono text-slate-700">₹ 0.0</td>
                </tr>
                <tr className="bg-slate-100/50">
                  <td colSpan={2} className="p-2 font-bold border-r border-slate-300">August Net Salary</td>
                  <td colSpan={2} className="p-2 font-bold font-mono text-right text-slate-900">₹ 13006.67</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-2 font-semibold border-r border-slate-300">Paid Amount</td>
                  <td colSpan={2} className="p-2 font-semibold font-mono text-right text-emerald-600">₹ 13006.67</td>
                </tr>
                <tr>
                  <td colSpan={2} className="p-2 font-semibold border-r border-slate-300 text-slate-500">Pending August Salary</td>
                  <td colSpan={2} className="p-2 font-semibold font-mono text-right text-slate-500">₹ 0.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Attendance Summary Section */}
          <div className="border border-slate-300 rounded-sm">
            <div className="bg-slate-50 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-700">
              Attendance Summary
            </div>
            <div className="p-3 space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">ATTENDANCE</div>
                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  <div>Present: <strong className="text-slate-900">15.0</strong></div>
                  <div>Absent: <strong className="text-slate-900">6.0</strong></div>
                  <div>Half Days: <strong className="text-slate-900">0.0</strong></div>
                  <div>Paid Leaves: <strong className="text-slate-900">1.0</strong></div>
                  <div>Unpaid Leaves: <strong className="text-slate-900">0.0</strong></div>
                  <div>Double Present: <strong className="text-slate-900">0.0</strong></div>
                  <div>Weekly Off: <strong className="text-slate-900">4.0</strong></div>
                  <div>Holidays: <strong className="text-slate-900">0.0</strong></div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">TIME</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Hours Worked: <strong className="text-slate-900">106h 29m</strong></div>
                  <div>Overtime: <strong className="text-slate-900">11h 58m</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Earnings Breakdown Section */}
          <div className="border border-slate-300 rounded-sm">
            <div className="bg-slate-50 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-700">
              Other Earnings Breakdown
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase bg-slate-50/50">
                  <th className="p-2">Earning Type</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Reimbursements</td>
                  <td className="p-2 text-slate-600">06 Aug 2026</td>
                  <td className="p-2 font-mono font-bold">₹ 2340.0</td>
                  <td className="p-2 text-slate-500 text-[11px]">showroom to busstand up down 40,addanki…</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Paid Amount Breakdown */}
          <div className="border border-slate-300 rounded-sm">
            <div className="bg-slate-50 px-3 py-1.5 font-bold text-[11px] border-b border-slate-300 text-slate-700">
              Paid Amount Breakdown
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase bg-slate-50/50">
                  <th className="p-2">Payment Type</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Salary</td>
                  <td className="p-2 text-slate-600">26 Aug 2026</td>
                  <td className="p-2 font-mono font-bold text-emerald-600">₹ 13006.67</td>
                  <td className="p-2 text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>Generated using <strong className="text-slate-600">SalaryBox App</strong></span>
            <span>Report date: 26-08-2026 16:24:50</span>
          </div>
        </div>
      </div>
    </div>
  );
}