"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Share2,
  Edit2,
  Calendar,
  X,
  Copy,
  FileSpreadsheet,
  Check
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface TaxDeclarationsProps {
  employee: {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
    jobTitle?: string;
    monthlyCtc?: number;
  };
  onBack: () => void;
}

export function TaxDeclarationsView({
  employee,
  onBack,
}: TaxDeclarationsProps) {
  const router = useRouter();
  const [financialYear, setFinancialYear] = useState("2026 - 2027");
  const [chosenRegime, setChosenRegime] = useState<"NEW" | "OLD">("NEW");

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isRegimeModalOpen, setIsRegimeModalOpen] = useState(false);
  const [isPastTdsModalOpen, setIsPastTdsModalOpen] = useState(false);
  const [pastTdsAmount, setPastTdsAmount] = useState("0.00");
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState("0.00");
  const [landlordPan, setLandlordPan] = useState("");

  const annualEarnings = ((employee.monthlyCtc || 28000) * 12);
  const formattedEarnings = `₹ ${annualEarnings.toLocaleString("en-IN")}.00`;
  const newRegimeStdDeduction = 75000;
  const oldRegimeStdDeduction = 50000;

  const newTaxable = Math.max(0, annualEarnings - newRegimeStdDeduction);
  const oldTaxable = Math.max(0, annualEarnings - oldRegimeStdDeduction);

  const handleCopyInvite = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs min-h-[750px] p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div
            className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold ${employee.avatarColor}`}
          >
            {employee.initials}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              {employee.name}
            </h2>
            <span className="text-[11px] font-medium text-slate-500">
              Employee
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Financial Year
            </span>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="text-xs px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 font-medium cursor-pointer"
            >
              <option>2026 - 2027</option>
              <option>2025 - 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Invite Staff
            </button>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Download Report
            </button>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          Tax Declarations for FY {financialYear.replace(" ", "")}
        </h1>
      </div>

      {/* 1. TDS Calculations Summary Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          TDS Calculations Summary
        </h3>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] border-b border-slate-200 font-semibold text-slate-600">
                <th className="px-5 py-3 w-1/3"></th>
                <th className="px-5 py-3 text-[#007BFF]">New Regime</th>
                <th className="px-5 py-3 text-[#007BFF]">Old Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr>
                <td className="px-5 py-2.5">Earnings</td>
                <td className="px-5 py-2.5 font-mono">{formattedEarnings}</td>
                <td className="px-5 py-2.5 font-mono">{formattedEarnings}</td>
              </tr>
              <tr>
                <td className="px-5 py-2.5">Exemptions</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
              </tr>
              <tr>
                <td className="px-5 py-2.5">Standard Deduction</td>
                <td className="px-5 py-2.5 font-mono">
                  ₹ {newRegimeStdDeduction.toLocaleString("en-IN")}.00
                </td>
                <td className="px-5 py-2.5 font-mono">
                  ₹ {oldRegimeStdDeduction.toLocaleString("en-IN")}.00
                </td>
              </tr>
              <tr>
                <td className="px-5 py-2.5">Deductions</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
              </tr>
              <tr className="bg-slate-50/50 font-bold text-slate-800">
                <td className="px-5 py-2.5">Taxable Income</td>
                <td className="px-5 py-2.5 font-mono">
                  ₹ {newTaxable.toLocaleString("en-IN")}.00
                </td>
                <td className="px-5 py-2.5 font-mono">
                  ₹ {oldTaxable.toLocaleString("en-IN")}.00
                </td>
              </tr>
              <tr className="font-bold text-[#007BFF]">
                <td className="px-5 py-2.5">Total Tax Liability</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
                <td className="px-5 py-2.5 font-mono">₹ 0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Past TDS in FY Card */}
      <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Past TDS in FY</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            TDS deducted by previous employer in current FY: ₹{pastTdsAmount}
          </p>
        </div>
        <button
          onClick={() => setIsPastTdsModalOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* 3. Chosen Regime Card */}
      <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">
            Your current chosen regime is{" "}
            <span className="text-[#007BFF] font-black">
              {chosenRegime} Tax Regime
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Default rebate under Section 87A up to ₹7 Lakhs applies under New Regime
          </p>
        </div>
        <button
          onClick={() => setIsRegimeModalOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* 4. Home Rent Card */}
      <div className="p-4 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Home Rent</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly rent paid for HRA tax exemption: ₹{monthlyRent}
          </p>
        </div>
        <button
          onClick={() => setIsRentModalOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-[#007BFF] border border-[#007BFF] rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* MODAL 1: Invite Staff (Screenshot 4) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">
                Staff Tax Declarations Portal
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 text-center leading-relaxed">
                Invite your staff to add tax declarations. Staff can add
                declarations by logging into <strong>web.salarybox.in</strong>
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopyInvite}
                  className="px-5 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Download Report Confirmation (Screenshot 2) */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-8 text-center space-y-4">
            {/* Big Blue Check Icon Circle */}
            <div className="w-14 h-14 rounded-full bg-[#007BFF] text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Report download in progress
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Downloaded reports are available in company reports
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsDownloadModalOpen(false);
                  router.push("/reports");
                }}
                className="px-6 py-2 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Go To Reports
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Change Regime */}
      {isRegimeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Select Tax Regime</h3>
              <button
                onClick={() => setIsRegimeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="regime"
                  checked={chosenRegime === "NEW"}
                  onChange={() => setChosenRegime("NEW")}
                  className="w-4 h-4 text-[#007BFF]"
                />
                <div>
                  <div className="font-bold text-slate-800">New Tax Regime</div>
                  <div className="text-[11px] text-slate-500">
                    Standard deduction ₹75,000 with zero tax up to ₹7 Lakhs
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="regime"
                  checked={chosenRegime === "OLD"}
                  onChange={() => setChosenRegime("OLD")}
                  className="w-4 h-4 text-[#007BFF]"
                />
                <div>
                  <div className="font-bold text-slate-800">Old Tax Regime</div>
                  <div className="text-[11px] text-slate-500">
                    Supports HRA, 80C, 80D with standard deduction ₹50,000
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsRegimeModalOpen(false)}
                className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRegimeModalOpen(false);
                  alert(`Tax regime updated to ${chosenRegime} Regime`);
                }}
                className="px-5 py-1.5 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Past TDS Modal */}
      {isPastTdsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Past TDS in FY</h3>
              <button
                onClick={() => setIsPastTdsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                TDS Deducted (₹)
              </label>
              <input
                type="number"
                value={pastTdsAmount}
                onChange={(e) => setPastTdsAmount(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsPastTdsModalOpen(false)}
                className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsPastTdsModalOpen(false)}
                className="px-5 py-1.5 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Home Rent HRA Modal */}
      {isRentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-6 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Home Rent Declaration</h3>
              <button
                onClick={() => setIsRentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 12000"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Landlord PAN (Required if rent &gt; ₹1 Lakh/yr)
              </label>
              <input
                type="text"
                value={landlordPan}
                onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                placeholder="e.g. ABCDE1234F"
                className="w-full px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsRentModalOpen(false)}
                className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsRentModalOpen(false)}
                className="px-5 py-1.5 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
