import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// 1. My Team Icon (from team-svgrepo-com.svg)
export function MyTeamIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// 2. Attendance Fingerprint Icon (from fingerprint-svgrepo-com.svg)
export function AttendanceIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.925.827A7.583 7.583 0 0115.66 9.316a.75.75 0 11-1.463-.333 6.083 6.083 0 00-8.61-6.81.75.75 0 01-.662-1.346zM3.278 2.903a.75.75 0 01.143 1.05 6.058 6.058 0 00-1.087 2.332 26.684 26.684 0 01-.811 2.9.75.75 0 11-1.416-.495c.262-.747.514-1.634.765-2.737a7.558 7.558 0 011.355-2.907.75.75 0 011.05-.143zm.259 3.656a4.85 4.85 0 019.176-.859.75.75 0 01-1.375.6A3.35 3.35 0 005 6.891c-.174.766-.354 1.46-.543 2.098a.75.75 0 01-1.438-.426c.179-.603.35-1.265.519-2.005zm3.548-.682a2.117 2.117 0 013.244 2.226 38.526 38.526 0 01-.684 2.614.75.75 0 11-1.436-.434c.235-.777.452-1.608.658-2.512a.617.617 0 00-.945-.649.75.75 0 01-.837-1.245zm5.345 1.935a.75.75 0 01.565.897c-.57 2.505-1.25 4.627-2.178 6.609a.75.75 0 01-1.358-.636c.871-1.86 1.52-3.874 2.073-6.305a.75.75 0 01.898-.565zm-5.768.673a.75.75 0 01.518.926c-.531 1.874-1.146 3.384-1.93 4.794-.057.103-.115.205-.174.307a.75.75 0 01-1.298-.75c.054-.095.108-.19.16-.285.72-1.296 1.295-2.696 1.798-4.475a.75.75 0 01.926-.517zm-3.487 1.998a.75.75 0 01.384.988c-.218.497-.45.96-.698 1.407a.75.75 0 01-1.311-.728c.226-.407.437-.83.637-1.283a.75.75 0 01.988-.385zm11.361.295a.75.75 0 01.516.927 34.364 34.364 0 01-.833 2.556.75.75 0 11-1.406-.522c.291-.785.554-1.596.796-2.445a.75.75 0 01.927-.516zm-6.21 1.53c.381.16.561.6.401.982a22.529 22.529 0 01-1.088 2.243.75.75 0 11-1.31-.729 21.03 21.03 0 001.015-2.094.75.75 0 01.981-.402z"
      />
    </svg>
  );
}

// 3. Payroll Cash Note Icon (matching screenshot 1:1)
export function PayrollIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

// 4. CRM Suitcase Icon (from suitcase-svgrepo-com.svg)
export function CrmSuitcaseIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 7V6.2C8 5.0799 8 4.51984 8.21799 4.09202C8.40973 3.71569 8.71569 3.40973 9.09202 3.21799C9.51984 3 10.0799 3 11.2 3H12.8C13.9201 3 14.4802 3 14.908 3.21799C15.2843 3.40973 15.5903 3.71569 15.782 4.09202C16 4.51984 16 5.0799 16 6.2V7M7 21V7.00169M17 21V7M7 7.00169C7.24373 7 7.50929 7 7.8 7H16M7 7.00169C5.83507 7.00979 5.16873 7.05658 4.63803 7.32698C4.07354 7.6146 3.6146 8.07354 3.32698 8.63803C3 9.27976 3 10.1198 3 11.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V11.8C21 10.1198 21 9.27976 20.673 8.63803C20.3854 8.07354 19.9265 7.6146 19.362 7.32698C18.7202 7 17.8802 7 16.2 7H17M17 7H16" />
    </svg>
  );
}

// 5. Reports File Check Icon (from file-check-alt-svgrepo-com.svg)
export function ReportsIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M15 19L17 21L21 17M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H11.5M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V13.4M9 17H11.5M9 13H15M9 9H10" />
    </svg>
  );
}

// 6. Location Pin Icon (from location-pin-alt-1-svgrepo-com.svg)
export function LocationIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" />
      <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" />
    </svg>
  );
}

// 7. Background Verification Shield Icon (from verify-svgrepo-com.svg)
export function VerificationIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8.38086 12.0001L10.7909 14.4201L15.6209 9.58008" />
      <path d="M10.7509 2.44982C11.4409 1.85982 12.5709 1.85982 13.2709 2.44982L14.8509 3.80982C15.1509 4.06982 15.7109 4.27982 16.1109 4.27982H17.8109C18.8709 4.27982 19.7409 5.14982 19.7409 6.20982V7.90982C19.7409 8.29982 19.9509 8.86982 20.2109 9.16982L21.5709 10.7498C22.1609 11.4398 22.1609 12.5698 21.5709 13.2698L20.2109 14.8498C19.9509 15.1498 19.7409 15.7098 19.7409 16.1098V17.8098C19.7409 18.8698 18.8709 19.7398 17.8109 19.7398H16.1109C15.7209 19.7398 15.1509 19.9498 14.8509 20.2098L13.2709 21.5698C12.5809 22.1598 11.4509 22.1598 10.7509 21.5698L9.17086 20.2098C8.87086 19.9498 8.31086 19.7398 7.91086 19.7398H6.18086C5.12086 19.7398 4.25086 18.8698 4.25086 17.8098V16.0998C4.25086 15.7098 4.04086 15.1498 3.79086 14.8498L2.44086 13.2598C1.86086 12.5698 1.86086 11.4498 2.44086 10.7598L3.79086 9.16982C4.04086 8.86982 4.25086 8.30982 4.25086 7.91982V6.19982C4.25086 5.13982 5.12086 4.26982 6.18086 4.26982H7.91086C8.30086 4.26982 8.87086 4.05982 9.17086 3.79982L10.7509 2.44982Z" />
    </svg>
  );
}

// 8. Billing & Subscriptions Credit Card Icon
export function BillingIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

// 9. Refer a Friend Gift Icon (from gift-svgrepo-com.svg)
export function ReferIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 7V20M12 7H8.46429C7.94332 7 7.4437 6.78929 7.07533 6.41421C6.70695 6.03914 6.5 5.53043 6.5 5C6.5 4.46957 6.70695 3.96086 7.07533 3.58579C7.4437 3.21071 7.94332 3 8.46429 3C11.2143 3 12 7 12 7ZM12 7H15.5357C16.0567 7 16.5563 6.78929 16.9247 6.41421C17.293 6.03914 17.5 5.53043 17.5 5C17.5 4.46957 17.293 3.96086 16.9247 3.58579C16.5563 3.21071 16.0567 3 15.5357 3C12.7857 3 12 7 12 7ZM5 12H19V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V12ZM4.6 12H19.4C19.9601 12 20.2401 12 20.454 11.891C20.6422 11.7951 20.7951 11.6422 20.891 11.454C21 11.2401 21 10.9601 21 10.4V8.6C21 8.03995 21 7.75992 20.891 7.54601C20.7951 7.35785 20.6422 7.20487 20.454 7.10899C20.2401 7 19.9601 7 19.4 7H4.6C4.03995 7 3.75992 7 3.54601 7.10899C3.35785 7.20487 3.20487 7.35785 3.10899 7.54601C3 7.75992 3 8.03995 3 8.6V10.4C3 10.9601 3 11.2401 3.10899 11.454C3.20487 11.6422 3.35785 11.7951 3.54601 11.891C3.75992 12 4.03995 12 4.6 12Z" />
    </svg>
  );
}

// 10. Header Pending Requests Clipboard Check Icon
export function HeaderPendingRequestsIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

// 11. Header Settings Gear Icon
export function HeaderSettingsIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// 12. Header Help Circle Icon
export function HeaderHelpIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// 13. Header Bell Icon
export function HeaderBellIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// 14. Header Megaphone Icon
export function HeaderMegaphoneIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

