'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, ChevronDown, Check, Building2, Calendar, Megaphone, Trash2 } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  description: string;
  branchIds: string[];
  createdAt: string;
  authorName?: string;
}

const AVAILABLE_BRANCHES = [
  { id: 'VIJAYAWADA', name: 'VIJAYAWADA' },
  { id: 'Addanki', name: 'Addanki' },
  { id: 'HQ Bangalore', name: 'HQ Bangalore' },
  { id: 'Guntur', name: 'Guntur' },
];

export function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const branchDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close branch dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBranchToggle = (branchName: string) => {
    if (selectedBranches.includes(branchName)) {
      setSelectedBranches(selectedBranches.filter((b) => b !== branchName));
    } else {
      setSelectedBranches([...selectedBranches, branchName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Title is required');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Description is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      branchIds: selectedBranches,
      createdAt: new Date().toISOString(),
      authorName: 'Admin',
    };

    // Add to local state
    setAnnouncements([newAnnouncement, ...announcements]);

    // Reset & Close
    setTitle('');
    setDescription('');
    setSelectedBranches([]);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-full flex flex-col -m-4 md:-m-6 bg-white">
      {/* 1. Header Bar */}
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/attendance"
            className="p-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Announcements</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMessage('');
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Send Announcement</span>
        </button>
      </div>

      {/* 2. Main Content Feed */}
      <div className="flex-1 flex flex-col">
        {announcements.length === 0 ? (
          // Empty State matching screenshot media_1788518015509.png
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="relative mb-4">
              {/* Stylized Tray Illustration */}
              <div className="w-20 h-16 bg-slate-100 rounded-lg border-2 border-slate-200 flex flex-col justify-end p-2 relative shadow-2xs">
                <div className="w-10 h-6 bg-white border border-slate-200 rounded-t-md mx-auto -mt-4 shadow-2xs"></div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
              </div>
              {/* Chat Bubble Badge */}
              <div className="absolute -top-2 -right-3 w-7 h-7 bg-slate-200/90 rounded-full flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500">No announcements yet</p>
          </div>
        ) : (
          // Announcements List
          <div className="px-6 py-6 divide-y divide-slate-100 max-w-4xl">
            {announcements.map((ann) => (
              <div key={ann.id} className="py-5 flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">{ann.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                    {ann.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {ann.branchIds.length === 0 ? 'All Branches' : ann.branchIds.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. New Announcement Modal (1:1 with media_1788518022589.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">New Announcement</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-400/20 text-slate-500 hover:bg-slate-300/40 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Callout Notice */}
              <div className="bg-[#F4F8FD] border border-[#DCE9F9] rounded-lg p-3.5 text-xs text-slate-600 leading-relaxed">
                Create a new announcement to engage with your team. Share important updates, celebrate achievements, or communicate company news.
              </div>

              {errorMessage && (
                <div className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Eg. Target Achieved"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Eg. We have achieved our Sales Target. Great job team!"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              {/* Branches (Optional) Field */}
              <div className="relative" ref={branchDropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Branches (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className="w-full min-h-[40px] px-3.5 py-2 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <div className="flex flex-wrap gap-1.5 text-left">
                    {selectedBranches.length === 0 ? (
                      <span className="text-slate-400">Select branches (leave empty for all branches)</span>
                    ) : (
                      selectedBranches.map((b) => (
                        <span
                          key={b}
                          className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-medium border border-blue-100 flex items-center gap-1"
                        >
                          {b}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBranchToggle(b);
                            }}
                            className="hover:text-blue-800 cursor-pointer"
                          >
                            ×
                          </span>
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ml-2 transition-transform ${isBranchDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBranchDropdownOpen && (
                  <div className="absolute bottom-full mb-1 left-0 w-full bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 max-h-48 overflow-y-auto">
                    {AVAILABLE_BRANCHES.map((branch) => {
                      const isSelected = selectedBranches.includes(branch.name);
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          onClick={() => handleBranchToggle(branch.name)}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{branch.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#007BFF] hover:bg-blue-600 text-white rounded-md text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
