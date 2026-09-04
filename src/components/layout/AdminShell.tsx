"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  Settings,
  HelpCircle,
  Bell,
  Megaphone,
  MessageSquare,
  Sparkles,
  LogOut
} from "lucide-react";
import {
  MyTeamIcon,
  AttendanceIcon,
  PayrollIcon,
  CrmSuitcaseIcon,
  ReportsIcon,
  LocationIcon,
  VerificationIcon,
  BillingIcon,
  ReferIcon
} from "../icons/SalaryBoxNavIcons";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendanceExpanded, setAttendanceExpanded] = useState(false);
  const [crmExpanded, setCrmExpanded] = useState(true);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<{
    name: string;
    role: string;
    initials: string;
    companyName: string;
    companyCode: string;
  }>({
    name: "PAPPU SRINIVASA PRABHAKAR RAO",
    role: "Admin",
    initials: "PR",
    companyName: "RSS LOGISTICS",
    companyCode: "IDGWDA",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/v1/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            const user = data.data;
            const fullName = user.employee
              ? `${user.employee.firstName || ""} ${user.employee.lastName || ""}`.trim()
              : user.name || user.email?.split("@")[0] || "PAPPU SRINIVASA PRABHAKAR RAO";

            const roleFormatted =
              user.role === "SUPER_ADMIN"
                ? "Super Admin"
                : user.role === "COMPANY_OWNER" || user.role === "HR_ADMIN"
                ? "Admin"
                : user.role === "MANAGER"
                ? "Manager"
                : "Staff";

            const parts = fullName.trim().split(/\s+/);
            const initials =
              parts.length > 1
                ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
                : fullName.slice(0, 2).toUpperCase();

            setUserProfile({
              name: fullName.toUpperCase(),
              role: roleFormatted,
              initials: initials || "PR",
              companyName: user.company?.name || "RSS LOGISTICS",
              companyCode: user.company?.companyCode || "IDGWDA",
            });
          }
        }
      } catch (err) {
        // Keep standard default
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {
      // ignore
    }
    window.location.href = "/login";
  };

  // Sub-items for Attendance
  const attendanceSubItems = [
    { name: "Live Attendance", href: "/attendance/live" },
    { name: "Daily Attendance", href: "/attendance/daily" },
    { name: "Attendance Dashboard", href: "/attendance/dashboard" },
    { name: "Company Roster", href: "/attendance/roster" },
  ];

  // Sub-items for CRM
  const crmSubItems = [
    { name: "Leads & Pipeline", href: "/crm/leads" },
    { name: "Customers", href: "/crm/customers" },
    { name: "Follow-ups & Tasks", href: "/crm/activities" },
  ];

  // Sub-items for Reports
  const reportsSubItems = [
    { name: "Download Reports", href: "/reports/download" },
    { name: "Schedule Reports", href: "/reports/schedule" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* 1. Left Sidebar */}
      <aside
        className={`flex flex-col border-r border-slate-200 bg-white transition-all duration-200 z-30 ${
          sidebarOpen ? "w-60 min-w-[240px]" : "w-16 min-w-[64px]"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {/* My Team */}
          <Link
            href="/my-team"
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              pathname.startsWith("/my-team")
                ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <MyTeamIcon className={`w-4 h-4 shrink-0 ${pathname.startsWith("/my-team") ? "text-[#007BFF]" : "text-slate-500"}`} />
              {sidebarOpen && <span>My Team</span>}
            </div>
          </Link>

          {/* Attendance (Expandable) */}
          <div>
            <button
              type="button"
              onClick={() => setAttendanceExpanded(!attendanceExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                pathname.startsWith("/attendance")
                  ? "bg-slate-50 text-[#007BFF] font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <AttendanceIcon className={`w-4 h-4 shrink-0 ${pathname.startsWith("/attendance") ? "text-[#007BFF]" : "text-slate-500"}`} />
                {sidebarOpen && <span>Attendance</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${attendanceExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                />
              )}
            </button>

            {sidebarOpen && attendanceExpanded && (
              <div className="ml-6 pl-2 border-l border-slate-200 mt-1 space-y-1">
                {attendanceSubItems.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isSubActive
                          ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payroll */}
          <Link
            href="/payroll"
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              pathname.startsWith("/payroll")
                ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <PayrollIcon className="w-4 h-4 shrink-0 text-slate-500" />
              {sidebarOpen && <span>Payroll</span>}
            </div>
            {sidebarOpen && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </Link>

          {/* CRM (Expandable) matching SalaryBox Style */}
          <div>
            <button
              type="button"
              onClick={() => setCrmExpanded(!crmExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                pathname.startsWith("/crm")
                  ? "bg-slate-50 text-[#007BFF] font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <CrmSuitcaseIcon className={`w-4 h-4 shrink-0 ${pathname.startsWith("/crm") ? "text-[#007BFF]" : "text-slate-500"}`} />
                {sidebarOpen && <span>CRM</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${crmExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                />
              )}
            </button>

            {sidebarOpen && crmExpanded && (
              <div className="ml-6 pl-2 border-l border-slate-200 mt-1 space-y-1">
                {crmSubItems.map((sub) => {
                  const isSubActive =
                    pathname === sub.href ||
                    (sub.href === "/crm/leads" && pathname === "/crm");
                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isSubActive
                          ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reports (Expandable) */}
          <div>
            <button
              type="button"
              onClick={() => setReportsExpanded(!reportsExpanded)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                pathname.startsWith("/reports")
                  ? "bg-slate-50 text-[#007BFF] font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <ReportsIcon className={`w-4 h-4 shrink-0 ${pathname.startsWith("/reports") ? "text-[#007BFF]" : "text-slate-500"}`} />
                {sidebarOpen && <span>Reports</span>}
              </div>
              {sidebarOpen && (
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${reportsExpanded ? "rotate-180 text-blue-600" : "text-slate-400"}`}
                />
              )}
            </button>

            {sidebarOpen && reportsExpanded && (
              <div className="ml-6 pl-2 border-l border-slate-200 mt-1 space-y-1">
                {reportsSubItems.map((sub) => {
                  const isSubActive =
                    pathname === sub.href ||
                    (sub.href === "/reports/download" && pathname === "/reports");
                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        isSubActive
                          ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Location */}
          <Link
            href="/location"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <LocationIcon className="w-4 h-4 shrink-0 text-slate-500" />
            {sidebarOpen && <span>Location</span>}
          </Link>

          {/* Background Verification */}
          <Link
            href="/verification"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <VerificationIcon className="w-4 h-4 shrink-0 text-slate-500" />
            {sidebarOpen && <span>Background Verification</span>}
          </Link>

          {/* Subscriptions & Billing */}
          <Link
            href="/billing"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
              pathname.startsWith("/billing") || pathname.startsWith("/subscriptions-billing")
                ? "bg-[#EBF5FF] text-[#007BFF] font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <BillingIcon className={`w-4 h-4 shrink-0 ${pathname.startsWith("/billing") || pathname.startsWith("/subscriptions-billing") ? "text-[#007BFF]" : "text-slate-500"}`} />
            {sidebarOpen && <span>Subscriptions & Billing</span>}
          </Link>

          {/* Refer a Friend */}
          <Link
            href="/refer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ReferIcon className="w-4 h-4 shrink-0 text-slate-500" />
            {sidebarOpen && <span>Refer a Friend</span>}
          </Link>
        </div>

        {/* Bottom SalaryBox Branding */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-2.5">
          <svg className="w-5 h-5 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 14l8-8 8 8-3.5 3.5L12 13l-4.5 4.5L4 14z" />
          </svg>
          {sidebarOpen && (
            <span className="font-bold text-slate-900 tracking-tight text-sm font-sans">
              Salary<span className="text-slate-900">Box</span>
            </span>
          )}
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                RSS
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-blue-600">
                  RSS LOGISTICS
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-medium">
                  Company Code: <strong className="text-slate-700 font-semibold">IDGWDA</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pending-requests"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Requests</span>
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                6
              </span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer"
            >
              <img src="/icons/setting-2-svgrepo-com.svg" alt="Settings" className="w-3.5 h-3.5 object-contain opacity-70" />
              <span>Settings</span>
            </Link>

            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer">
              <img src="/icons/help-circle-svgrepo-com.svg" alt="Help" className="w-3.5 h-3.5 object-contain opacity-70" />
              <span>Help</span>
            </button>

            <Link
              href="/notifications"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full cursor-pointer flex items-center justify-center transition-colors"
              title="Notifications"
            >
              <img src="/icons/bell-svgrepo-com.svg" alt="Notifications" className="w-4 h-4 object-contain opacity-70" />
            </Link>

            <Link
              href="/announcements"
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full cursor-pointer flex items-center justify-center transition-colors"
              title="Announcements"
            >
              <img src="/icons/announcement-svgrepo-com.svg" alt="Announcements" className="w-4 h-4 object-contain opacity-70" />
            </Link>

            {/* Profile Avatar & Dropdown Popup */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200 cursor-pointer ml-1 hover:ring-2 hover:ring-purple-200 transition-all focus:outline-none"
                aria-label="User profile menu"
                aria-expanded={profileOpen}
              >
                {userProfile.initials}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-1.5">
                    <div className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug uppercase">
                      {userProfile.name}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Role - {userProfile.role}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-1.5"></div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC]">
          {children}
        </main>
      </div>

      <button
        aria-label="Help Chat"
        className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-[#007BFF] text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-transform active:scale-95 z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}