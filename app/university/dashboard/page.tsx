"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  PlusCircle,
  History,
  ShieldCheck,
  Search,
  Download,
  Copy,
  Ban,
  CheckCircle2,
  Award,
  Calendar,
  AlertCircle,
  ExternalLink,
  QrCode,
  Check,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { formatDate, formatDateTime } from "@/lib/utils";

function UniversityDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Issue Form State
  const [issueData, setIssueData] = useState({
    recipientName: "",
    studentIdNumber: "",
    studentEmail: "",
    title: "",
    department: "",
    grade: "",
    description: "",
    issueDate: new Date().toISOString().split("T")[0],
  });
  const [issuing, setIssuing] = useState(false);
  const [issueSuccessCert, setIssueSuccessCert] = useState<any | null>(null);

  // Revocation State
  const [revokeCertId, setRevokeCertId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      setUser(meData.user);

      if (meData.user?.universityId) {
        const certRes = await fetch(`/api/certificates?universityId=${meData.user.universityId}`);
        const certData = await certRes.json();
        setCertificates(certData.certificates || []);
      } else {
        const certRes = await fetch("/api/certificates");
        const certData = await certRes.json();
        setCertificates(certData.certificates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to issue certificate.");
      } else {
        setIssueSuccessCert(data.certificate);
        setIssueData({
          recipientName: "",
          studentIdNumber: "",
          studentEmail: "",
          title: "",
          department: "",
          grade: "",
          description: "",
          issueDate: new Date().toISOString().split("T")[0],
        });
        fetchData();
      }
    } catch (err) {
      console.error("Issuance error:", err);
    } finally {
      setIssuing(false);
    }
  };

  const handleRevokeCertificate = async () => {
    if (!revokeCertId || !revokeReason.trim()) return;
    setRevoking(true);
    try {
      const res = await fetch(`/api/certificates/${revokeCertId}/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: revokeReason.trim() }),
      });
      if (res.ok) {
        setRevokeCertId(null);
        setRevokeReason("");
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to revoke certificate.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRevoking(false);
    }
  };

  const issuedCount = certificates.filter((c) => c.status === "ISSUED").length;
  const revokedCount = certificates.filter((c) => c.status === "REVOKED").length;

  return (
    <DashboardLayout activeRole="UNIVERSITY_ADMIN">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
            <span>{user?.university?.name || "Authorized Institution"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Registrar Issuance Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Issue cryptographically anchored certificates, manage records, and monitor verifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/university/dashboard?tab=issue">
            <GlassButton variant="primary" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
              Issue New Certificate
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1">
          <span className="text-xs text-slate-400">Total Issued</span>
          <div className="text-2xl font-bold font-mono text-white">{certificates.length}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-1">
          <span className="text-xs text-slate-400">Active & Valid</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">{issuedCount}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-1">
          <span className="text-xs text-slate-400">Recalled / Revoked</span>
          <div className="text-2xl font-bold font-mono text-red-400">{revokedCount}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-1">
          <span className="text-xs text-slate-400">Issuer Status</span>
          <div className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
            {user?.university?.status || "APPROVED"}
          </div>
        </GlassCard>
      </div>

      {/* SUCCESS CONFIRMATION MODAL AFTER ISSUANCE */}
      {issueSuccessCert && (
        <GlassCard className="p-6 border-emerald-500/40 bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">
                Certificate Successfully Issued & Anchored
              </h3>
            </div>
            <button
              onClick={() => setIssueSuccessCert(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block font-sans">Certificate ID</span>
              <span className="font-bold text-cyan-300">{issueSuccessCert.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">Recipient</span>
              <span className="font-bold text-white">{issueSuccessCert.recipientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-sans">SHA-256 Digest</span>
              <span className="text-slate-300 break-all">{issueSuccessCert.certHash}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`/api/certificates/${issueSuccessCert.id}/download`}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Generated PDF</span>
            </a>
            <a
              href={`/verify?id=${issueSuccessCert.id}`}
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify On-Chain</span>
            </a>
          </div>
        </GlassCard>
      )}

      {/* TAB: ISSUE CERTIFICATE FORM */}
      {(currentTab === "issue" || currentTab === "overview") && (
        <GlassCard className="p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" />
              <span>Issue New Academic Credential</span>
            </h2>
            <p className="text-xs text-slate-400">
              Compiles canonical PDF, computes SHA-256 fingerprint, and registers on Ethereum blockchain
            </p>
          </div>

          <form onSubmit={handleIssueCertificate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={issueData.recipientName}
                  onChange={(e) => setIssueData({ ...issueData, recipientName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Institutional Student ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MIT-2024-884"
                  value={issueData.studentIdNumber}
                  onChange={(e) => setIssueData({ ...issueData, studentIdNumber: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Student Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@alumni.edu"
                  value={issueData.studentEmail}
                  onChange={(e) => setIssueData({ ...issueData, studentEmail: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Degree / Credential Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master of Science in Data Science"
                  value={issueData.title}
                  onChange={(e) => setIssueData({ ...issueData, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Department / School</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Computer Science"
                  value={issueData.department}
                  onChange={(e) => setIssueData({ ...issueData, department: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Academic Honors / Grade</label>
                <input
                  type="text"
                  placeholder="e.g. Magna Cum Laude, GPA 3.92"
                  value={issueData.grade}
                  onChange={(e) => setIssueData({ ...issueData, grade: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Conferral Date</label>
                <input
                  type="date"
                  value={issueData.issueDate}
                  onChange={(e) => setIssueData({ ...issueData, issueDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Certificate Description / Citation</label>
              <textarea
                rows={2}
                placeholder="In recognition of outstanding dedication and fulfillment of academic requirements..."
                value={issueData.description}
                onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              loading={issuing}
              icon={<ShieldCheck className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Sign & Register on Blockchain
            </GlassButton>
          </form>
        </GlassCard>
      )}

      {/* TAB: MANAGE ISSUED CERTIFICATES */}
      {(currentTab === "certificates" || currentTab === "overview") && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Issued Credentials</h2>
              <p className="text-xs text-slate-400">
                Manage, verify, download, or revoke credentials issued by this institution
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Certificate ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Degree Title</th>
                  <th className="py-3 px-3">Issue Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-cyan-400">
                      {cert.id}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {cert.recipientName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {cert.title}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatDate(cert.issueDate)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          cert.status === "ISSUED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <a
                        href={`/api/certificates/${cert.id}/download`}
                        target="_blank"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                      <a
                        href={`/verify?id=${cert.id}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Verify
                      </a>
                      {cert.status === "ISSUED" && (
                        <button
                          onClick={() => setRevokeCertId(cert.id)}
                          className="text-red-400 hover:text-red-300 font-semibold"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* REVOKE MODAL */}
      {revokeCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <GlassCard className="max-w-md w-full p-6 space-y-4 border-red-500/40">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              <span>Revoke Certificate</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are executing an on-chain revocation of certificate <code className="text-cyan-300">{revokeCertId}</code>. This action is permanently recorded on the blockchain.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Revocation Rationale (Required)
              </label>
              <textarea
                rows={3}
                required
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Degree cancelled following academic misconduct review..."
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={() => setRevokeCertId(null)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                variant="danger"
                size="sm"
                loading={revoking}
                onClick={handleRevokeCertificate}
              >
                Confirm Revocation
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function UniversityDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Registrar Console...</div>}>
      <UniversityDashboardContent />
    </Suspense>
  );
}
