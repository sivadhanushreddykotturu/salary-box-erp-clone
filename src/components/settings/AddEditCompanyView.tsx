"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Loader2,
  Upload,
  Trash2,
  X,
  AlertCircle
} from "lucide-react";

export const BUSINESS_TYPES = [
  "Educational Institute",
  "Heavy Machinery",
  "Security Services",
  "Hospital / Clinic",
  "Supermarket",
  "Agriculture / Farming",
  "Contractor / Manpower Agency",
  "Hotel / Lodge",
  "Construction",
  "Printing",
  "Manufacturing",
  "Restaurant / Dhaba",
  "Logistics / Transport",
  "Garments / Textile",
  "Jewellery",
  "Showroom / Outlet",
  "Tailoring / Boutique",
  "Saloon",
  "Grocery / Kirana / General Store",
  "School",
  "Distribution",
  "Financial Services",
  "Call Center",
  "NGO / Non-profit",
  "News Channel",
  "Cable Service Provider",
  "Internet Service Provider",
  "Automobile Workshop",
  "IT Software",
  "Pest Control",
  "Pharmacy Store / Medical Store",
  "Gym/Health/Fitness",
  "Other",
] as const;

export function AddEditCompanyView() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Form state
  const [companyName, setCompanyName] = useState("RSS LOGISTICS");
  const [companyCode, setCompanyCode] = useState("IDGWDA");
  const [businessType, setBusinessType] = useState<string>("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [udyamNumber, setUdyamNumber] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Business dropdown UI state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avatar edit modal
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation state
  const [udyamError, setUdyamError] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial company data from DB
  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const res = await fetch("/api/v1/settings");
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.company) {
            const comp = json.data.company;
            if (comp.name) setCompanyName(comp.name);
            if (comp.companyCode) setCompanyCode(comp.companyCode);
            if (comp.businessType) setBusinessType(comp.businessType);
            if (comp.address) setCompanyAddress(comp.address);
            if (comp.udyamNumber) setUdyamNumber(comp.udyamNumber);
            if (comp.logo) setLogoUrl(comp.logo);
          }
        }
      } catch (err) {
        console.error("Failed to fetch company details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyData();
  }, []);

  // Format UDYAM Number as UDYAM-XX-00-0000000
  const handleUdyamChange = (rawVal: string) => {
    let clean = rawVal.toUpperCase().replace(/[^A-Z0-9]/g, "");

    let formatted = clean;
    if (clean.startsWith("UDYAM")) {
      const rest = clean.slice(5);
      const statePart = rest.slice(0, 2); // 2 letters
      const districtPart = rest.slice(2, 4); // 2 digits
      const serialPart = rest.slice(4, 11); // 7 digits

      let parts = ["UDYAM"];
      if (statePart) parts.push(statePart);
      if (districtPart) parts.push(districtPart);
      if (serialPart) parts.push(serialPart);
      formatted = parts.join("-");
    } else if (clean.length > 0) {
      if ("UDYAM".startsWith(clean)) {
        formatted = clean;
      } else {
        formatted = clean;
      }
    }

    if (formatted.length > 19) {
      formatted = formatted.slice(0, 19);
    }

    setUdyamNumber(formatted);

    // Validate format: UDYAM-XX-00-0000000
    if (formatted.length > 0 && formatted.length < 19) {
      setUdyamError("UDYAM registration number must be 19 characters (e.g. UDYAM-AP-01-0012345)");
    } else if (formatted.length === 19) {
      const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
      if (!udyamRegex.test(formatted)) {
        setUdyamError("Invalid format. Expected: UDYAM-XX-00-0000000 (XX=State, 00=District, 7 digits Serial)");
      } else {
        setUdyamError(null);
      }
    } else {
      setUdyamError(null);
    }
  };

  // Image Upload Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (PNG, JPG, WEBP)", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setLogoUrl(base64);
      setAvatarModalOpen(false);
      showToast("Company logo selected! Click Update to save changes.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setLogoUrl(null);
    setAvatarModalOpen(false);
    showToast("Logo removed! Click Update to save changes.");
  };

  // Update company details to DB via API
  const handleUpdate = async () => {
    if (!companyName.trim()) {
      showToast("Company name cannot be empty", "error");
      return;
    }

    if (udyamNumber.trim() && udyamNumber.trim().length !== 19) {
      showToast("Please enter a valid 19-character UDYAM registration number", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyDetails: {
            name: companyName.trim(),
            businessType: businessType || null,
            address: companyAddress.trim() || null,
            udyamNumber: udyamNumber.trim() || null,
            logo: logoUrl || null,
          },
        }),
      });

      if (res.ok) {
        showToast("Company details updated successfully");
      } else {
        const errJson = await res.json().catch(() => ({}));
        showToast(errJson?.message || "Failed to update company details", "error");
      }
    } catch (err) {
      console.error("Error updating company:", err);
      showToast("Network error updating company details", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border animate-in fade-in slide-in-from-top-2 ${
            toastType === "success"
              ? "bg-slate-900 text-white border-slate-700"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {toastType === "success" ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Back Navigation matching Screenshot 2 */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/setting")}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Back to settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Company Detail</h1>
        </div>

        {saving && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Top Bar of Card: Company Name & Blue Update Button */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {companyName || "RSS LOGISTICS"}
            </span>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saving || loading}
              className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-6 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
            >
              {saving ? "Updating..." : "Update"}
            </button>
          </div>

          {/* Center Logo Section */}
          <div className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="relative group">
              <button
                type="button"
                onClick={() => setAvatarModalOpen(true)}
                className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-200 bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all hover:border-blue-500 hover:shadow-md focus:outline-none"
                title={logoUrl ? "Edit Image" : "Add Image"}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-700 select-none p-2 text-center">
                    {/* Stylized RSS LOGISTICS Circular Logo Badge */}
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#1E3A8A] flex items-center justify-center text-[10px] font-black text-white">
                        RSS
                      </div>
                      <span className="text-[11px] font-extrabold text-[#0F172A] tracking-tighter uppercase leading-none">
                        LOGISTICS
                      </span>
                    </div>
                  </div>
                )}

                {/* Hover overlay for Edit / Add Image */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                  <Camera className="w-5 h-5 mb-1 text-white" />
                  <span className="text-[10px] font-medium text-white">
                    {logoUrl ? "Edit Image" : "Add Image"}
                  </span>
                </div>
              </button>
            </div>

            {/* Company Code display */}
            <div className="mt-4 text-xs text-slate-700">
              <span>Company Code : </span>
              <span className="font-bold text-slate-900">{companyCode}</span>
            </div>
          </div>

          {/* Form Fields matching horizontal layout in Screenshot 2 */}
          <div className="px-6 md:px-14 pb-12 pt-2 space-y-4 max-w-3xl mx-auto">
            {/* Company Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-xs text-slate-700 sm:w-48 sm:text-right shrink-0">
                Company Name :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>
            </div>

            {/* Business Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-xs text-slate-700 sm:w-48 sm:text-right shrink-0">
                Business Type :
              </label>
              <div className="flex-1 relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full text-xs text-left px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className={businessType ? "text-slate-800" : "text-slate-400"}>
                    {businessType || "Select bussiness type"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Options List */}
                {dropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-100">
                    {BUSINESS_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setBusinessType(type);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between cursor-pointer ${
                          businessType === type
                            ? "bg-blue-50/70 text-blue-600 font-semibold"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{type}</span>
                        {businessType === type && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Company Address */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-xs text-slate-700 sm:w-48 sm:text-right shrink-0">
                Company Address :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Company Address"
                  className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>
            </div>

            {/* Udyam Registration Number */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="text-xs text-slate-700 sm:w-48 sm:text-right shrink-0 sm:pt-2">
                Udyam Registration Number :
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={(e) => handleUdyamChange(e.target.value)}
                  placeholder="Udyam Registration Number"
                  maxLength={19}
                  className={`w-full text-xs font-mono uppercase text-slate-800 px-3.5 py-2 border rounded focus:ring-1 outline-none transition-all placeholder:text-slate-400 bg-white ${
                    udyamError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {udyamError ? (
                  <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{udyamError}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: <span className="font-mono text-slate-600">UDYAM-XX-00-0000000</span> (19 characters)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Image Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {logoUrl ? "Edit Company Image" : "Add Company Image"}
              </h3>
              <button
                type="button"
                onClick={() => setAvatarModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center bg-slate-50">
                {logoUrl ? (
                  <img src={logoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-300" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleImageFileChange}
              />

              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{logoUrl ? "Upload New Image" : "Choose Image"}</span>
                </button>

                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Supported formats: PNG, JPG, WEBP. Max size: 5MB.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
