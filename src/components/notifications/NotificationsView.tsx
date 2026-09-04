'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Search, Bell, Calendar, LogIn, LogOut, FileText, Clock, AlertTriangle, CheckCircle2, User } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: string; // 'PUNCH_IN' | 'PUNCH_OUT' | 'LEAVE_REQUEST' | 'LATE_COMING' | 'EARLY_LEAVING' | 'OVERTIME' | 'ANNOUNCEMENT';
  title: string;
  employeeName: string;
  employeeCode?: string;
  branch: string;
  department: string;
  timeString: string;
  address: string;
  timestamp: string;
  photoUrl?: string;
  avatarText?: string;
  avatarBg?: string;
  isRead?: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'PUNCH_IN',
    title: 'DARA DEEKSHITH has punched in.',
    employeeName: 'DARA DEEKSHITH',
    employeeCode: 'EMP-001',
    branch: 'VIJAYAWADA',
    department: 'Operations',
    timeString: '10:40 AM',
    address: 'Lakshmi subbarao sai kavya Building, Block XIII, TDP OFFICE, P48 54-10-21 C, Dist, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India',
    timestamp: '10:40',
    avatarText: 'D',
    avatarBg: 'bg-slate-200 text-slate-700',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-2',
    type: 'PUNCH_IN',
    title: 'Durga Prasad Cargo CUG has punched in.',
    employeeName: 'Durga Prasad Cargo CUG',
    employeeCode: 'EMP-002',
    branch: 'VIJAYAWADA',
    department: 'Operations',
    timeString: '10:33 AM',
    address: 'Lakshmi subbarao sai kavya Building, Block XIII, TDP OFFICE, P48 54-10-21 C, Dist, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India',
    timestamp: '10:34',
    avatarText: 'D',
    avatarBg: 'bg-amber-100 text-amber-800',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-3',
    type: 'PUNCH_IN',
    title: 'Saleem has punched in.',
    employeeName: 'Saleem',
    employeeCode: 'EMP-003',
    branch: 'VIJAYAWADA',
    department: 'Technical',
    timeString: '10:00 AM',
    address: 'GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India',
    timestamp: '10:02',
    avatarText: 'S',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-4',
    type: 'PUNCH_IN',
    title: 'Shaaru has punched in.',
    employeeName: 'Shaaru',
    employeeCode: 'EMP-004',
    branch: 'VIJAYAWADA',
    department: 'Technical',
    timeString: '09:59 AM',
    address: 'GM2F+G66, P48, Auto Nagar, Vijayawada, Andhra Pradesh 520007, India',
    timestamp: '10:00',
    avatarText: 'S',
    avatarBg: 'bg-purple-100 text-purple-800',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-5',
    type: 'LEAVE_REQUEST',
    title: 'Ramesh Babu applied for Leave (Casual Leave - 2 Days).',
    employeeName: 'Ramesh Babu',
    employeeCode: 'EMP-005',
    branch: 'Addanki',
    department: 'Accounts',
    timeString: '09:15 AM',
    address: 'Addanki Regional Hub, Main Road, Addanki, Andhra Pradesh 523201, India',
    timestamp: '09:15',
    avatarText: 'R',
    avatarBg: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'notif-6',
    type: 'LATE_COMING',
    title: 'Kiran Kumar marked Late Punch In (Late by 45 mins).',
    employeeName: 'Kiran Kumar',
    employeeCode: 'EMP-006',
    branch: 'HQ Bangalore',
    department: 'Technical',
    timeString: '10:15 AM',
    address: 'Indiranagar Tech Center, 100 Feet Rd, HAL 2nd Stage, Bangalore, Karnataka 560038, India',
    timestamp: 'Yesterday',
    avatarText: 'K',
    avatarBg: 'bg-rose-100 text-rose-800',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'notif-7',
    type: 'PUNCH_OUT',
    title: 'Priya Sharma has punched out.',
    employeeName: 'Priya Sharma',
    employeeCode: 'EMP-007',
    branch: 'Guntur',
    department: 'Management',
    timeString: '07:05 PM',
    address: 'Ring Road Office Hub, Arundelpet, Guntur, Andhra Pradesh 522002, India',
    timestamp: 'Yesterday',
    avatarText: 'P',
    avatarBg: 'bg-indigo-100 text-indigo-800',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
];

const NOTIFICATION_TYPES = [
  { label: 'All Notifications', value: 'ALL' },
  { label: 'Punch In', value: 'PUNCH_IN' },
  { label: 'Punch Out', value: 'PUNCH_OUT' },
  { label: 'Leave Requests', value: 'LEAVE_REQUEST' },
  { label: 'Late Markings', value: 'LATE_COMING' },
  { label: 'Early Leaves', value: 'EARLY_LEAVING' },
  { label: 'Overtime', value: 'OVERTIME' },
  { label: 'Announcements', value: 'ANNOUNCEMENT' },
];

const BRANCH_OPTIONS = [
  { label: 'All Branches', value: 'ALL' },
  { label: 'VIJAYAWADA', value: 'VIJAYAWADA' },
  { label: 'Addanki', value: 'Addanki' },
  { label: 'HQ Bangalore', value: 'HQ Bangalore' },
  { label: 'Guntur', value: 'Guntur' },
];

const DEPARTMENT_OPTIONS = [
  { label: 'All Departments', value: 'ALL' },
  { label: 'Operations', value: 'Operations' },
  { label: 'Technical', value: 'Technical' },
  { label: 'Accounts', value: 'Accounts' },
  { label: 'Management', value: 'Management' },
];

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Dropdown Open States
  const [openTypeDropdown, setOpenTypeDropdown] = useState<boolean>(false);
  const [openBranchDropdown, setOpenBranchDropdown] = useState<boolean>(false);
  const [openDeptDropdown, setOpenDeptDropdown] = useState<boolean>(false);

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setOpenTypeDropdown(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setOpenBranchDropdown(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target as Node)) {
        setOpenDeptDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // 1. Type filter
      if (selectedType !== 'ALL' && item.type !== selectedType) {
        return false;
      }
      // 2. Branch filter
      if (selectedBranch !== 'ALL' && item.branch !== selectedBranch) {
        return false;
      }
      // 3. Department filter
      if (selectedDepartment !== 'ALL' && item.department !== selectedDepartment) {
        return false;
      }
      // 4. Search filter (All Employees search box)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = item.employeeName.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesAddress = item.address.toLowerCase().includes(query);
        const matchesBranch = item.branch.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        if (!matchesName && !matchesTitle && !matchesAddress && !matchesBranch && !matchesDept) {
          return false;
        }
      }
      return true;
    });
  }, [notifications, selectedType, selectedBranch, selectedDepartment, searchTerm]);

  const selectedTypeLabel = NOTIFICATION_TYPES.find((t) => t.value === selectedType)?.label || 'All Notifications';
  const selectedBranchLabel = BRANCH_OPTIONS.find((b) => b.value === selectedBranch)?.label || 'All Branches';
  const selectedDeptLabel = DEPARTMENT_OPTIONS.find((d) => d.value === selectedDepartment)?.label || 'All Departments';

  const renderBadgeIcon = (type: string) => {
    switch (type) {
      case 'PUNCH_IN':
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
            <Calendar className="w-2.5 h-2.5" />
          </div>
        );
      case 'PUNCH_OUT':
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
            <LogOut className="w-2.5 h-2.5" />
          </div>
        );
      case 'LEAVE_REQUEST':
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
            <FileText className="w-2.5 h-2.5" />
          </div>
        );
      case 'LATE_COMING':
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
            <Clock className="w-2.5 h-2.5" />
          </div>
        );
      default:
        return (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-xs">
            <Bell className="w-2.5 h-2.5" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-full flex flex-col -m-4 md:-m-6 bg-white">
      {/* 1. Page Header */}
      <div className="border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <Link
          href="/attendance"
          className="p-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Notifications</h1>
      </div>

      {/* 2. Filter Bar */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Dropdown 1: Notification Types */}
        <div className="relative" ref={typeDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setOpenTypeDropdown(!openTypeDropdown);
              setOpenBranchDropdown(false);
              setOpenDeptDropdown(false);
            }}
            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700 hover:border-slate-300 shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <div className="flex items-center gap-2 truncate">
              <Bell className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{selectedTypeLabel}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openTypeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {openTypeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
              {NOTIFICATION_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value);
                    setOpenTypeDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedType === type.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{type.label}</span>
                  {selectedType === type.value && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 2: Branches */}
        <div className="relative" ref={branchDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setOpenBranchDropdown(!openBranchDropdown);
              setOpenTypeDropdown(false);
              setOpenDeptDropdown(false);
            }}
            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700 hover:border-slate-300 shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <span className="truncate">{selectedBranchLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openBranchDropdown ? 'rotate-180' : ''}`} />
          </button>

          {openBranchDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
              {BRANCH_OPTIONS.map((branch) => (
                <button
                  key={branch.value}
                  type="button"
                  onClick={() => {
                    setSelectedBranch(branch.value);
                    setOpenBranchDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedBranch === branch.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{branch.label}</span>
                  {selectedBranch === branch.value && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 3: Departments */}
        <div className="relative" ref={deptDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setOpenDeptDropdown(!openDeptDropdown);
              setOpenTypeDropdown(false);
              setOpenBranchDropdown(false);
            }}
            className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-md flex items-center justify-between text-xs text-slate-700 hover:border-slate-300 shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <span className="truncate">{selectedDeptLabel}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${openDeptDropdown ? 'rotate-180' : ''}`} />
          </button>

          {openDeptDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
              {DEPARTMENT_OPTIONS.map((dept) => (
                <button
                  key={dept.value}
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(dept.value);
                    setOpenDeptDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedDepartment === dept.value
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{dept.label}</span>
                  {selectedDepartment === dept.value && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter 4: All Employees Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="All Employees"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-3.5 pr-8 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs transition-all"
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1"
            >
              ✕
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          )}
        </div>
      </div>

      {/* 3. Notifications List Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-2 divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search term</p>
            {(selectedType !== 'ALL' || selectedBranch !== 'ALL' || selectedDepartment !== 'ALL' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedType('ALL');
                  setSelectedBranch('ALL');
                  setSelectedDepartment('ALL');
                  setSearchTerm('');
                }}
                className="mt-4 px-3 py-1.5 text-xs text-blue-600 font-medium hover:bg-blue-50 rounded-md border border-blue-200 transition-colors"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className="py-4 flex items-start gap-3.5 hover:bg-slate-50/60 -mx-6 px-6 transition-colors">
              {/* Left Avatar with Type Badge */}
              <div className="relative shrink-0 mt-0.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    notif.avatarBg || 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {notif.avatarText || notif.employeeName.charAt(0)}
                </div>
                {renderBadgeIcon(notif.type)}
              </div>

              {/* Middle Notification Content */}
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {notif.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  <span className="font-medium text-slate-600">{notif.timeString}</span> | {notif.address}
                </p>

                {/* Punch Selfie Thumbnail */}
                {notif.photoUrl && (
                  <div className="mt-2.5">
                    <img
                      src={notif.photoUrl}
                      alt={notif.employeeName}
                      className="w-28 h-20 object-cover rounded-md border border-slate-200 shadow-2xs hover:opacity-95 transition-opacity"
                    />
                  </div>
                )}
              </div>

              {/* Right Timestamp */}
              <div className="shrink-0 text-right">
                <span className="text-xs text-slate-400 font-normal">
                  {notif.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
