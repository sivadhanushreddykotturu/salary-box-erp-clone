"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Search, FileCheck } from "lucide-react";

export function VerificationView() {
  const records = [
    { name: "Anil", aadhaar: "•••• •••• 4812", pan: "ABCPA••••K", bank: "HDFC Bank (Penny Drop Verified)", status: "VERIFIED" },
    { name: "Bobba Prasad", aadhaar: "•••• •••• 9102", pan: "BKPPR••••L", bank: "SBI (Penny Drop Verified)", status: "VERIFIED" },
    { name: "Priyanka EDP RSS VJA", aadhaar: "•••• •••• 8834", pan: "PRYED••••M", bank: "Kotak Mahindra (Penny Drop Verified)", status: "VERIFIED" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Background Verification & KYC</h1>
          <p className="text-xs text-slate-500">Decentro automated Aadhaar, PAN, and Bank Account penny drop verification</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
              <th className="px-4 py-3">STAFF NAME</th>
              <th className="px-4 py-3">AADHAAR KYC</th>
              <th className="px-4 py-3">PAN CARD</th>
              <th className="px-4 py-3">BANK PENNY DROP</th>
              <th className="px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {records.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3.5 font-bold text-slate-900">{r.name}</td>
                <td className="px-4 py-3.5 font-mono">{r.aadhaar}</td>
                <td className="px-4 py-3.5 font-mono">{r.pan}</td>
                <td className="px-4 py-3.5 text-slate-600">{r.bank}</td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Verified</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}