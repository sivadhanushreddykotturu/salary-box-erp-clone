"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  Kanban,
  Table as TableIcon,
  Phone,
  X
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  stage: "NEW" | "CONTACTED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";
  estimatedValue: number;
  assignedTo: string;
  nextFollowUp?: string;
  notes?: string;
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    name: "Kiran Kumar",
    company: "Apex Warehousing Pvt Ltd",
    phone: "9848012345",
    email: "kiran@apexwarehousing.in",
    stage: "NEW",
    estimatedValue: 120000,
    assignedTo: "Rajesh Service Manager",
    nextFollowUp: "Tomorrow, 11:00 AM",
    notes: "Requires GPS tracking and 50+ staff attendance for 3 warehouses",
  },
  {
    id: "lead-2",
    name: "Venkatesh Rao",
    company: "Delta Express Cargo",
    phone: "9848023456",
    email: "v.rao@deltaexpress.com",
    stage: "CONTACTED",
    estimatedValue: 85000,
    assignedTo: "Durga Prasad Cargo",
    nextFollowUp: "05 Sep 2026",
    notes: "Discussed biometric vs mobile app punch. Sent brochure.",
  },
  {
    id: "lead-3",
    name: "Suresh Reddy",
    company: "Amaravati Cold Storage",
    phone: "9848034567",
    email: "suresh@amaravaticold.in",
    stage: "PROPOSAL",
    estimatedValue: 240000,
    assignedTo: "Rajesh Service Manager",
    nextFollowUp: "06 Sep 2026",
    notes: "Custom proposal sent with 100 employee tier + geofence.",
  },
  {
    id: "lead-4",
    name: "Mohan Krishna",
    company: "Krishna Valley Transports",
    phone: "9848045678",
    email: "mohan@kvtrans.com",
    stage: "NEGOTIATION",
    estimatedValue: 180000,
    assignedTo: "Bobba Prasad",
    nextFollowUp: "Today, 4:00 PM",
    notes: "Final contract negotiation for annual enterprise subscription.",
  },
  {
    id: "lead-5",
    name: "Srinivas Rao",
    company: "Sri Sai Supermarket Chain",
    phone: "9848056789",
    email: "srinivas@srisaigroup.in",
    stage: "WON",
    estimatedValue: 350000,
    assignedTo: "Priyanka EDP",
    nextFollowUp: "Completed",
    notes: "Closed 1-year contract with 8 supermarket branches.",
  },
];

const STAGE_CONFIG = {
  NEW: { label: "New Leads", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  CONTACTED: { label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  PROPOSAL: { label: "Proposal Sent", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  NEGOTIATION: { label: "Negotiation", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  WON: { label: "Won / Closed", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  LOST: { label: "Lost", color: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
};

export function CrmPipelineView() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    estimatedValue: 50000,
    stage: "NEW" as LeadItem["stage"],
    assignedTo: "Rajesh Service Manager",
    notes: "",
  });

  const totalPipeline = leads.reduce((acc, l) => acc + l.estimatedValue, 0);
  const wonPipeline = leads.filter((l) => l.stage === "WON").reduce((acc, l) => acc + l.estimatedValue, 0);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.company) {
      alert("Please provide Contact Name and Company");
      return;
    }

    const created: LeadItem = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      company: newLead.company,
      phone: newLead.phone || "9848000000",
      email: newLead.email,
      stage: newLead.stage,
      estimatedValue: Number(newLead.estimatedValue),
      assignedTo: newLead.assignedTo,
      nextFollowUp: "Tomorrow, 10:00 AM",
      notes: newLead.notes,
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
  };

  const handleMoveStage = (leadId: string, nextStage: LeadItem["stage"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nextStage } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, stage: nextStage });
    }
  };

  const filteredLeads = leads
    .filter((l) => (stageFilter === "ALL" ? true : l.stage === stageFilter))
    .filter(
      (l) =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stages: LeadItem["stage"][] = ["NEW", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Total Pipeline Value</div>
          <div className="text-lg font-bold text-slate-900 mt-1">₹{totalPipeline.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{leads.length} total deals</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Deals Won / Closed</div>
          <div className="text-lg font-bold text-emerald-600 mt-1">₹{wonPipeline.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            {leads.filter((l) => l.stage === "WON").length} converted clients
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Active Negotiations</div>
          <div className="text-lg font-bold text-orange-600 mt-1">
            {leads.filter((l) => l.stage === "NEGOTIATION" || l.stage === "PROPOSAL").length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">High probability closing</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">Pending Follow-ups</div>
          <div className="text-lg font-bold text-[#007BFF] mt-1">4 Scheduled</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across all executives</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative min-w-[220px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Lead, Company, Executive"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>

          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-700 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New Leads</option>
              <option value="CONTACTED">Contacted</option>
              <option value="PROPOSAL">Proposal Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "kanban" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs transition-colors self-end md:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lead</span>
        </button>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
          {stages.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg);
            const stageTotal = stageLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

            return (
              <div key={stg} className="bg-[#FAFBFD] rounded-lg border border-slate-200 p-3 flex flex-col min-w-[230px]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${STAGE_CONFIG[stg].dot}`} />
                    <span className="text-xs font-bold text-slate-800">{STAGE_CONFIG[stg].label}</span>
                    <span className="text-[10px] font-semibold bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-600">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    ₹{Math.round(stageTotal / 1000)}k
                  </div>
                </div>

                <div className="space-y-2.5 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-md bg-white">
                      No deals in {STAGE_CONFIG[stg].label}
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{lead.company}</h4>
                          <span className="text-xs font-bold text-[#007BFF]">
                            ₹{lead.estimatedValue.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 font-medium">{lead.name}</div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="truncate max-w-[110px]">{lead.assignedTo}</span>
                          <span className="text-amber-600 font-medium">{lead.nextFollowUp || "Follow-up"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-[#FAFBFD] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">COMPANY & LEAD</th>
                <th className="px-4 py-3">CONTACT</th>
                <th className="px-4 py-3">STAGE</th>
                <th className="px-4 py-3">DEAL VALUE</th>
                <th className="px-4 py-3">ASSIGNED TO</th>
                <th className="px-4 py-3">NEXT FOLLOW-UP</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{lead.company}</div>
                    <div className="text-[11px] text-slate-500">{lead.name}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STAGE_CONFIG[lead.stage].color}`}>
                      {STAGE_CONFIG[lead.stage].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    ₹{lead.estimatedValue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{lead.assignedTo}</td>
                  <td className="px-4 py-3 text-amber-600 font-medium">{lead.nextFollowUp || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Add New CRM Lead / Deal</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLead} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Logistics Ltd"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kiran Kumar"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@company.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deal Value (₹)</label>
                  <input
                    type="number"
                    value={newLead.estimatedValue}
                    onChange={(e) => setNewLead({ ...newLead, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stage</label>
                  <select
                    value={newLead.stage}
                    onChange={(e) => setNewLead({ ...newLead, stage: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="NEW">New Leads</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="PROPOSAL">Proposal Sent</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="WON">Won / Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign To</label>
                  <select
                    value={newLead.assignedTo}
                    onChange={(e) => setNewLead({ ...newLead, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Rajesh Service Manager</option>
                    <option>Durga Prasad Cargo</option>
                    <option>Bobba Prasad</option>
                    <option>Priyanka EDP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Requirement details, expected timeline, etc."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <button onClick={() => setSelectedLead(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
                <div className="font-bold text-slate-800 text-xs">Deal Details</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STAGE_CONFIG[selectedLead.stage].color}`}>
                  {STAGE_CONFIG[selectedLead.stage].label}
                </span>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedLead.company}</h3>
                  <div className="text-slate-500 font-medium mt-0.5">{selectedLead.name}</div>
                </div>

                <div className="bg-[#FAFBFD] p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Estimated Value:</span>
                    <span className="text-sm font-bold text-[#007BFF]">₹{selectedLead.estimatedValue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phone:</span>
                    <span className="font-mono text-slate-800">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Assigned Executive:</span>
                    <span className="text-slate-800 font-semibold">{selectedLead.assignedTo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Next Follow-up:</span>
                    <span className="text-amber-600 font-semibold">{selectedLead.nextFollowUp || "Tomorrow"}</span>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-700 mb-1">Notes & Discussion</div>
                  <div className="text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                    {selectedLead.notes || "No notes logged yet."}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-700 mb-2">Advance Deal Stage</div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedLead.stage !== "CONTACTED" && (
                      <button
                        onClick={() => handleMoveStage(selectedLead.id, "CONTACTED")}
                        className="p-2 border border-slate-200 rounded text-center font-semibold hover:bg-slate-50"
                      >
                        → Mark Contacted
                      </button>
                    )}
                    {selectedLead.stage !== "PROPOSAL" && (
                      <button
                        onClick={() => handleMoveStage(selectedLead.id, "PROPOSAL")}
                        className="p-2 border border-slate-200 rounded text-center font-semibold hover:bg-slate-50"
                      >
                        → Proposal Sent
                      </button>
                    )}
                    {selectedLead.stage !== "NEGOTIATION" && (
                      <button
                        onClick={() => handleMoveStage(selectedLead.id, "NEGOTIATION")}
                        className="p-2 border border-slate-200 rounded text-center font-semibold hover:bg-slate-50"
                      >
                        → Negotiation
                      </button>
                    )}
                    {selectedLead.stage !== "WON" && (
                      <button
                        onClick={() => handleMoveStage(selectedLead.id, "WON")}
                        className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded text-center font-bold hover:bg-emerald-100"
                      >
                        ✔ Mark as Won!
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Close
              </button>
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-[#007BFF] hover:bg-blue-600 rounded-md shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}