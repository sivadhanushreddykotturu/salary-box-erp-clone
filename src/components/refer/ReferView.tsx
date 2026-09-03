"use client";

import React from "react";
import { Gift, Copy, Share2, Award, Users } from "lucide-react";

export function ReferView() {
  const referCode = "RSS2026";
  const referLink = "https://salarybox.in/join/RSS2026";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto">
          <Gift className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black">Refer a Business & Earn ₹500</h1>
        <p className="text-xs text-blue-100 max-w-md mx-auto">
          Invite other logistics, transport, or retail business owners to SalaryBox. When they subscribe, you both get ₹500 Cash reward!
        </p>

        <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 max-w-sm mx-auto flex items-center justify-between border border-white/20">
          <span className="font-mono font-bold text-sm tracking-widest">{referCode}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(referLink);
              alert("Referral link copied!");
            }}
            className="flex items-center gap-1 px-3 py-1 bg-white text-blue-700 rounded text-xs font-bold hover:bg-blue-50"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}