"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  UserCheck, 
  Building2, 
  GraduationCap, 
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Route based on role
      if (data.user.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "UNIVERSITY_ADMIN") {
        router.push("/university/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing/evaluating roles
  const quickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role-Based Access Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sign In to CertiChain
          </h1>
          <p className="text-slate-400 text-sm">
            Access your university registrar, student portal, or admin console
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3.5 rounded-2xl glass-card border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-cyan-400">
              <Sparkles className="w-3 h-3" /> Quick Demo Roles:
            </span>
            <span>Click to fill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => quickFill("admin@certichain.io", "AdminPassword123!")}
              className="px-2 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-all"
            >
              <UserCheck className="w-3 h-3" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill("registrar@mit.edu", "UniversityPassword123!")}
              className="px-2 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-all"
            >
              <Building2 className="w-3 h-3" />
              <span>Registrar</span>
            </button>
            <button
              type="button"
              onClick={() => quickFill("alex.rivera@alumni.mit.edu", "StudentPassword123!")}
              className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-all"
            >
              <GraduationCap className="w-3 h-3" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <GlassCard className="p-7 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 select-none cursor-pointer">
                Remember this session for 7 days
              </label>
            </div>

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Sign In to Account
            </GlassButton>
          </form>

          {/* Footer inside card */}
          <div className="pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/auth/register" className="text-cyan-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
