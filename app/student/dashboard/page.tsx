"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  Building2,
  QrCode,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);

      if (meData.user?.email) {
        const certRes = await fetch(`/api/certificates?studentEmail=${encodeURIComponent(meData.user.email)}`);
        const certData = await certRes.json();
        setCertificates(certData.certificates || []);
      }
    } catch (err) {
      console.error("Student data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyVerificationLink = (certId: string) => {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <DashboardLayout activeRole="STUDENT">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student & Graduate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Academic Credentials
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View, download official PDF diplomas, and share cryptographic verification links
          </p>
        </div>
      </div>

      {/* Certificates Cards */}
      <div className="space-y-6">
        {certificates.length === 0 && !loading && (
          <GlassCard className="p-12 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Credentials Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your university registrar has not yet linked certificates to your email address ({user?.email}).
            </p>
          </GlassCard>
        )}

        {certificates.map((cert) => (
          <GlassCard
            key={cert.id}
            glow="blue"
            className="p-6 sm:p-8 space-y-6 border-white/15 relative overflow-hidden"
          >
            {/* Holographic corner gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-400/10 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  {cert.id}
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {cert.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cert.university?.name}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Conferred: {formatDate(cert.issueDate)}</span>
                  </span>
                </div>
              </div>

              {/* Status pill */}
              <div className="shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    cert.status === "ISSUED"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-red-500/20 text-red-400 border border-red-500/40"
                  }`}
                >
                  {cert.status === "ISSUED" ? "Verified On-Chain" : "Revoked"}
                </span>
              </div>
            </div>

            {/* Middle: Details & Fingerprint */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                {cert.description && (
                  <p className="text-xs text-slate-300 italic">
                    "{cert.description}"
                  </p>
                )}

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-sans">SHA-256 Digest:</span>
                    <span className="text-slate-300 truncate max-w-xs">{cert.certHash}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-sans">Blockchain Tx:</span>
                    <span className="text-cyan-400 truncate max-w-xs">{cert.txHash}</span>
                  </div>
                </div>
              </div>

              {/* QR Code thumbnail */}
              {cert.qrCodeDataUrl && (
                <div className="md:col-span-4 flex justify-center md:justify-end">
                  <div className="p-2 rounded-xl bg-white shadow-md text-center">
                    <img
                      src={cert.qrCodeDataUrl}
                      alt="Credential Verification QR"
                      className="w-24 h-24"
                    />
                    <span className="text-[10px] text-slate-700 font-bold block mt-1">
                      Verification QR
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/api/certificates/${cert.id}/download`}
                  target="_blank"
                >
                  <GlassButton variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
                    Download Official PDF
                  </GlassButton>
                </a>

                <button
                  onClick={() => copyVerificationLink(cert.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
                >
                  {copiedId === cert.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Share Verification URL</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href={`/verify?id=${cert.id}`}
                target="_blank"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Live Blockchain Proof</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
