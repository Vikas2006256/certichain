"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  FileCheck2,
  GraduationCap,
  Cpu,
  History,
  LogOut,
  Menu,
  X,
  UserCheck,
  Award,
  PlusCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: "SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "STUDENT";
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeRole,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  // Navigation Links tailored to Role
  const navItems = {
    SUPER_ADMIN: [
      { name: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "Universities", href: "/admin/dashboard?tab=universities", icon: <Building2 className="w-4 h-4" /> },
      { name: "All Certificates", href: "/admin/dashboard?tab=certificates", icon: <FileCheck2 className="w-4 h-4" /> },
      { name: "Blockchain Ledger", href: "/admin/dashboard?tab=blockchain", icon: <Cpu className="w-4 h-4" /> },
      { name: "Audit Trail", href: "/admin/dashboard?tab=audit", icon: <History className="w-4 h-4" /> },
    ],
    UNIVERSITY_ADMIN: [
      { name: "Overview", href: "/university/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "Issue Certificate", href: "/university/dashboard?tab=issue", icon: <PlusCircle className="w-4 h-4 text-cyan-400" /> },
      { name: "Manage Certificates", href: "/university/dashboard?tab=certificates", icon: <FileCheck2 className="w-4 h-4" /> },
      { name: "Verification Logs", href: "/university/dashboard?tab=logs", icon: <History className="w-4 h-4" /> },
    ],
    STUDENT: [
      { name: "My Credentials", href: "/student/dashboard", icon: <Award className="w-4 h-4" /> },
      { name: "Verify Credential", href: "/verify", icon: <ShieldCheck className="w-4 h-4" /> },
    ],
  };

  const roleLabels = {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-blue-500/15 border-blue-500/30 text-blue-400" },
    UNIVERSITY_ADMIN: { label: "University Registrar", color: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" },
    STUDENT: { label: "Student Portal", color: "bg-purple-500/15 border-purple-500/30 text-purple-400" },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080D1B] relative">
      {/* Mobile top toggle bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A1022] border-b border-white/10 sticky top-20 z-30">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleLabels[activeRole].color}`}>
            {roleLabels[activeRole].label}
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-20 bottom-0 left-0 w-64 bg-[#0A1022]/90 backdrop-blur-2xl border-r border-white/[0.08] p-5 flex flex-col justify-between z-40 transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* User profile capsule */}
          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleLabels[activeRole].color}`}>
                {roleLabels[activeRole].label}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white truncate">
                {user?.name || "Authenticated Operator"}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {user?.university?.name || user?.email || "certichain.io"}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems[activeRole].map((item) => {
              const isActive = pathname === item.href.split("?")[0];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white/[0.08] text-cyan-300 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Quick Links & Logout */}
        <div className="pt-4 border-t border-white/[0.08] space-y-2">
          <Link
            href="/verify"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Public Verifier</span>
            </span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        {children}
      </main>
    </div>
  );
};
