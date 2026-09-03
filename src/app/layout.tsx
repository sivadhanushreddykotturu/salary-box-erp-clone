import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalaryBox App | ERP & HRMS SaaS",
  description: "Effortless Employee Management, Attendance & Payroll",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}