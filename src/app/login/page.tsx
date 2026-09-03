"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("9542843456");
  const [pin, setPin] = useState(["7", "7", "8", "8"]);
  const [loading, setLoading] = useState(false);

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...pin];
    updated[index] = val;
    setPin(updated);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pinCode = pin.join("");
      const res = await fetch("/api/v1/auth/employee-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          pin: pinCode || "7788",
        }),
      });

      // Default mock fallback or redirect to My Team
      router.push("/my-team");
    } catch (err) {
      router.push("/my-team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-white font-sans">
      {/* Left Column: Login Form matching Screenshot 1 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Top Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00D1B2] flex items-center justify-center text-white font-black text-base shadow-sm">
            ⚡
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#007BFF]">
            Salary<span className="text-[#00D1B2]">Box</span>
          </span>
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full my-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Effortless Employee Management
          </h1>

          <div className="text-sm text-slate-500 mb-6">
            Enter login PIN for <br />
            <span className="font-semibold text-slate-800">+91 - {phoneNumber}</span>{" "}
            <button
              type="button"
              className="text-[#007BFF] font-medium hover:underline ml-1"
              onClick={() => {
                const newNum = prompt("Enter mobile number:", phoneNumber);
                if (newNum) setPhoneNumber(newNum);
              }}
            >
              Change Number?
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* 4-digit PIN Boxes */}
            <div className="flex gap-3">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  id={`pin-${idx}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] shadow-xs"
                />
              ))}
            </div>

            {/* Blue Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#007BFF] hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors text-base"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>

            {/* Forgot PIN */}
            <div className="text-xs text-slate-500">
              Forgot PIN?{" "}
              <button
                type="button"
                className="text-[#007BFF] font-semibold hover:underline"
                onClick={() => alert("Reset instructions sent to " + phoneNumber)}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="text-xs text-slate-400">
          © 2026 SalaryBox. All rights reserved.
        </div>
      </div>

      {/* Right Column: Visual Marketing Illustration matching Screenshot 1 */}
      <div className="hidden lg:flex w-1/2 bg-[#F8FAFC] flex-col justify-center items-center relative p-12 overflow-hidden border-l border-slate-100">
        <div className="relative z-10 flex flex-col items-center">
          {/* Dark Floating Feature Checklist Card matching Screenshot 1 */}
          <div className="bg-[#2D3139] text-white p-5 rounded-xl shadow-xl w-64 mb-6 border border-slate-700/50">
            <ul className="space-y-3.5 text-xs font-medium">
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Track Attendance</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Check Staff Location</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>Manage Payroll</span>
              </li>
            </ul>
          </div>

          {/* Illustration Avatar / Character representation */}
          <div className="w-64 h-64 rounded-full bg-blue-100/60 flex items-center justify-center relative shadow-inner mb-8">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center text-white shadow-md">
              <div className="text-center">
                <div className="text-4xl font-black mb-1">📱</div>
                <span className="text-xs font-bold uppercase tracking-wider">SalaryBox App</span>
              </div>
            </div>
          </div>

          {/* Trust Badges matching Screenshot 1 */}
          <div className="flex items-center gap-8 mt-2">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-slate-800">Used by 2 Lakh+</div>
                <div className="text-slate-500">Business Owners</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-slate-800">100% Safe & Secure</div>
                <div className="text-slate-500">With data backup</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}