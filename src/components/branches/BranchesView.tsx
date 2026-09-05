"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Search,
  MapPin,
  Layers,
  Maximize2,
  Minus,
  Navigation
} from "lucide-react";
import { BranchMapPicker } from "./BranchMapPicker";

export interface BranchItem {
  id: string;
  name: string;
  code?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export function BranchesView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "list" | "edit" | "new"
  const [viewMode, setViewMode] = useState<"list" | "edit" | "new">("list");
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  // Live branches list
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: "branch-1",
      name: "Addanki",
      code: "ADK-01",
      address: "20-49-4, Veera Brahmendra Swamy Temple Area, Narasimha Puram, Addanki, Andhra Pradesh 523201, India",
      latitude: 15.8118,
      longitude: 79.9754,
      radiusMeters: 20,
    },
    {
      id: "branch-2",
      name: "Guntur",
      code: "GNT-01",
      address: "8FCH+C4X, Autonagar, Agatavarappadu, Andhra Pradesh 522001, India",
      latitude: 16.3067,
      longitude: 80.4365,
      radiusMeters: 50,
    },
    {
      id: "branch-3",
      name: "VIJAYAWADA",
      code: "VJA-01",
      address: "GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India",
      latitude: 16.5062,
      longitude: 80.6480,
      radiusMeters: 20,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Form inputs for Add / Edit
  const [formName, setFormName] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formRadius, setFormRadius] = useState<number>(100);
  const [formLat, setFormLat] = useState<number>(16.5062);
  const [formLng, setFormLng] = useState<number>(80.6480);
  const [formSearchQuery, setFormSearchQuery] = useState("");
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGettingAddress, setIsGettingAddress] = useState(false);

  // Map controls
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [zoomLevel, setZoomLevel] = useState(15);

  // Delete Confirmation Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch branches from DB API
  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/v1/branches");
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setBranches(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load branches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Open Edit Mode
  const handleOpenEdit = (branch: BranchItem) => {
    setEditingBranchId(branch.id);
    setFormName(branch.name);
    setFormAddress(branch.address || "");
    setFormRadius(branch.radiusMeters || 100);
    setFormLat(branch.latitude || 16.5062);
    setFormLng(branch.longitude || 80.6480);
    setFormSearchQuery("");
    setViewMode("edit");
  };

  // Open New Branch Mode
  const handleOpenNew = () => {
    setEditingBranchId(null);
    setFormName("");
    setFormAddress("");
    setFormRadius(100);
    setFormLat(16.5062);
    setFormLng(80.6480);
    setFormSearchQuery("");
    setViewMode("new");
  };

  // Reverse Geocode: Get Address from Lat/Lng
  const handleGetAddress = async () => {
    setIsGettingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${formLat}&lon=${formLng}&zoom=18&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setFormAddress(data.display_name);
          showToast("Address fetched from map location");
          return;
        }
      }
      // Fallback
      setFormAddress(`Location near Lat ${formLat.toFixed(4)}, Lng ${formLng.toFixed(4)}`);
      showToast("Coordinates mapped to address");
    } catch (e) {
      setFormAddress(`Coordinates: ${formLat.toFixed(4)}, ${formLng.toFixed(4)}`);
      showToast("Coordinates set as address");
    } finally {
      setIsGettingAddress(false);
    }
  };

  // Search places on Map
  const handleSearchPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSearchQuery.trim()) return;

    setIsSearchingLocation(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formSearchQuery
        )}&limit=1`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const first = data[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);
          setFormLat(newLat);
          setFormLng(newLng);
          if (!formAddress) {
            setFormAddress(first.display_name || formSearchQuery);
          }
          showToast(`Location set to: ${first.name || formSearchQuery}`);
          return;
        }
      }
      showToast("No locations found for this query", "error");
    } catch (err) {
      showToast("Failed to search location", "error");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Handle Save (Create) or Update (Edit)
  const handleSubmit = async () => {
    if (!formName.trim()) {
      showToast("Please enter a Branch Name", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (viewMode === "new") {
        const payload = {
          name: formName.trim(),
          address: formAddress.trim() || null,
          radiusMeters: Number(formRadius) || 100,
          latitude: Number(formLat) || 16.5062,
          longitude: Number(formLng) || 80.6480,
        };

        const res = await fetch("/api/v1/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setBranches((prev) => [json.data, ...prev]);
          } else {
            // Local state fallback
            const localNew: BranchItem = {
              id: `branch-${Date.now()}`,
              name: formName.trim(),
              address: formAddress.trim(),
              radiusMeters: Number(formRadius) || 100,
              latitude: Number(formLat) || 16.5062,
              longitude: Number(formLng) || 80.6480,
            };
            setBranches((prev) => [localNew, ...prev]);
          }
          showToast("Branch created successfully");
          setViewMode("list");
        } else {
          showToast("Failed to create branch in database", "error");
        }
      } else if (viewMode === "edit" && editingBranchId) {
        const payload = {
          id: editingBranchId,
          name: formName.trim(),
          address: formAddress.trim() || null,
          radiusMeters: Number(formRadius) || 100,
          latitude: Number(formLat) || 16.5062,
          longitude: Number(formLng) || 80.6480,
        };

        const res = await fetch("/api/v1/branches", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setBranches((prev) =>
            prev.map((b) =>
              b.id === editingBranchId
                ? {
                    ...b,
                    name: formName.trim(),
                    address: formAddress.trim(),
                    radiusMeters: Number(formRadius) || 100,
                    latitude: Number(formLat) || 16.5062,
                    longitude: Number(formLng) || 80.6480,
                  }
                : b
            )
          );
          showToast("Branch updated successfully");
          setViewMode("list");
        } else {
          showToast("Failed to update branch", "error");
        }
      }
    } catch (err) {
      console.error("Error saving branch:", err);
      showToast("Network error saving branch", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Branch with Confirmation
  const handleDeleteBranch = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/branches?id=${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBranches((prev) => prev.filter((b) => b.id !== deleteConfirmId));
        showToast("Branch deleted successfully");
        setDeleteConfirmId(null);
      } else {
        // Fallback remove locally
        setBranches((prev) => prev.filter((b) => b.id !== deleteConfirmId));
        showToast("Branch removed from list");
        setDeleteConfirmId(null);
      }
    } catch (err) {
      setBranches((prev) => prev.filter((b) => b.id !== deleteConfirmId));
      showToast("Branch removed from list");
      setDeleteConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  const currentEditingBranch = useMemo(() => {
    return branches.find((b) => b.id === editingBranchId);
  }, [branches, editingBranchId]);

  // Radius color helper: Teal for <= 20m, Amber for > 20m
  const getRadiusBadgeColor = (radius: number) => {
    if (radius <= 20) {
      return "bg-[#009688]"; // Teal badge
    }
    return "bg-[#F59E0B]"; // Amber/Yellow badge
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-16">
      {/* Toast Notification */}
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

      {/* Top Header Bar: Back to Settings + Subtitle */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (viewMode !== "list") {
                setViewMode("list");
              } else {
                router.push("/setting");
              }
            }}
            className="p-1 rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Company Branches</h1>
        </div>

        {submitting && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      {/* Breadcrumb Navigation when in Edit or Add Mode */}
      {viewMode !== "list" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 text-xs text-slate-500 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className="hover:text-blue-600 cursor-pointer font-medium"
          >
            All Branches
          </button>
          <span>/</span>
          <span className="text-slate-800 font-semibold">
            {viewMode === "edit"
              ? currentEditingBranch?.name || formName || "Edit Branch"
              : "Add Branches"}
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LIST VIEW (Screenshot 1) */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Card Header: Branches + Add New Branch Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
                Branches
              </h2>

              <button
                type="button"
                onClick={handleOpenNew}
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Branch</span>
              </button>
            </div>

            {/* Branches List Rows */}
            <div className="divide-y divide-slate-100">
              {branches.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No branches found. Click "+ Add New Branch" to create one.
                </div>
              ) : (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Left: Round Radius Badge + Name/Address */}
                    <div className="flex items-center gap-4 flex-1 pr-4">
                      {/* Radius Badge (Teal / Amber) */}
                      <div
                        className={`w-11 h-11 rounded-full ${getRadiusBadgeColor(
                          branch.radiusMeters
                        )} text-white flex flex-col items-center justify-center text-center shadow-sm shrink-0 leading-tight`}
                      >
                        <span className="text-[10px] font-bold">
                          {branch.radiusMeters} m
                        </span>
                        <span className="text-[8px] font-medium opacity-90">Radius</span>
                      </div>

                      {/* Branch Name & Address */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 tracking-tight">
                          {branch.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {branch.address ||
                            `Coordinates: ${branch.latitude.toFixed(4)}, ${branch.longitude.toFixed(4)}`}
                        </div>
                      </div>
                    </div>

                    {/* Right: Edit & Delete Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(branch)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(branch.id)}
                        className="p-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer shadow-2xs"
                        title="Delete branch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT / ADD BRANCH VIEW (Screenshots 2 & 3) */}
      {/* ========================================================================= */}
      {viewMode !== "list" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Top Bar of Card: Title & Action Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span className="text-xs md:text-sm font-bold text-slate-800 tracking-tight">
                {viewMode === "edit"
                  ? currentEditingBranch?.name || formName || "Branch Details"
                  : "Create New Branch"}
              </span>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1464D2] text-white text-xs font-semibold px-6 py-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
              >
                {submitting
                  ? "Saving..."
                  : viewMode === "edit"
                  ? "Update"
                  : "Save"}
              </button>
            </div>

            {/* Form Fields & Map Section */}
            <div className="p-6 md:p-8 space-y-5">
              {/* Field 1: Branch Name */}
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1.5">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter Branch Name"
                  className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>

              {/* Field 2: Branch Address (choose location on map) + Get Address Button */}
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1.5">
                  Branch Address (choose location on map)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Branch Address"
                    className="flex-1 text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleGetAddress}
                    disabled={isGettingAddress}
                    className="bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-semibold px-5 py-2 rounded transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm"
                  >
                    {isGettingAddress ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    <span>Get Address</span>
                  </button>
                </div>
              </div>

              {/* Field 3: Radius (in metre) */}
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1.5">
                  Radius (in metre)
                </label>
                <input
                  type="number"
                  value={formRadius}
                  onChange={(e) => setFormRadius(Number(e.target.value))}
                  placeholder="100"
                  min={5}
                  max={5000}
                  className="w-full text-xs text-slate-800 px-3.5 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
              </div>

              {/* Field 4: Search For Places on Map */}
              <form onSubmit={handleSearchPlace} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formSearchQuery}
                  onChange={(e) => setFormSearchQuery(e.target.value)}
                  placeholder="Search For Places"
                  className="w-full text-xs text-slate-800 pl-9 pr-24 py-2 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 bg-white"
                />
                <button
                  type="submit"
                  disabled={isSearchingLocation}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isSearchingLocation ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </form>

              {/* Real Interactive Google & OSM Map Engine */}
              <BranchMapPicker
                latitude={formLat}
                longitude={formLng}
                radiusMeters={formRadius}
                onLocationChange={(lat, lng) => {
                  setFormLat(lat);
                  setFormLng(lng);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Delete Branch?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Are you sure you want to delete this branch? Employees assigned to this branch
              will need to be reassigned to another branch.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 border border-slate-200 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteBranch}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Delete Branch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
