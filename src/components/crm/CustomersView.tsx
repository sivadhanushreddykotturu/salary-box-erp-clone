"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export function CustomersView() {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    { id: "1", name: "Sri Sai Supermarket Chain", contact: "Srinivas Rao", phone: "9848056789", gst: "37AABCS1429B1Z5", branches: 8, contractValue: 350000, status: "ACTIVE" },
    { id: "2", name: "Amaravati Logistics Hub", contact: "M. Venkatesh", phone: "9848098765", gst: "37AAACL5120C1ZP", branches: 3, contractValue: 180000, status: "ACTIVE" },
    { id: "3", name: "Vijayawada Auto Spares Corp", contact: "P. Raghava", phone: "9848065432", gst: "37AADCV9981D1ZQ", branches: 2, contractValue: 95000, status: "ACTIVE" },
  ];

  const filtered = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Customer Accounts</h1>
          <p className="text-xs text-slate-500">Active client businesses, locations, and annual contracts</p>
        </div>

        <div className="relative max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Customers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase">
              <th className="px-4 py-3">CUSTOMER NAME</th>
              <th className="px-4 py-3">PRIMARY CONTACT</th>
              <th className="px-4 py-3">GST NUMBER</th>
              <th className="px-4 py-3">BRANCHES</th>
              <th className="px-4 py-3">ANNUAL VALUE</th>
              <th className="px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3.5 font-bold text-slate-900">{c.name}</td>
                <td className="px-4 py-3.5">{c.contact} ({c.phone})</td>
                <td className="px-4 py-3.5 font-mono text-slate-600">{c.gst}</td>
                <td className="px-4 py-3.5 text-slate-600">{c.branches} Locations</td>
                <td className="px-4 py-3.5 font-bold text-slate-900">₹{c.contractValue.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
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