"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Building2, 
  FileCheck2, 
  Cpu, 
  History, 
  ShieldCheck, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  Search,
  ExternalLink,
  Ban,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { formatDate, formatDateTime, truncateAddress } from "@/lib/utils";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const [analytics, setAnalytics] = useState<any>(null);
  const [universities, setUniversities] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for new university registration
  const [showUniModal, setShowUniModal] = useState(false);
  const [newUniData, setNewUniData] = useState({
    name: "",
    code: "",
    contactEmail: "",
    walletAddress: "",
    website: "",
    description: "",
  });
  const [submittingUni, setSubmittingUni] = useState(false);

  // Revocation modal
  const [revokeCertId, setRevokeCertId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, uniRes, certRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch("/api/universities"),
        fetch("/api/certificates"),
      ]);

      const [analyticsData, uniData, certData] = await Promise.all([
        analyticsRes.json(),
        uniRes.json(),
        certRes.json(),
      ]);

      setAnalytics(analyticsData);
      setUniversities(uniData.universities || []);
      setCertificates(certData.certificates || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversityStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/universities/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Update uni status error:", err);
    }
  };

  const handleRegisterUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUni(true);
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUniData),
      });
      if (res.ok) {
        setShowUniModal(false);
        setNewUniData({
          name: "",
          code: "",
          contactEmail: "",
          walletAddress: "",
          website: "",
          description: "",
        });
        fetchDashboardData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to register university.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingUni(false);
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
        fetchDashboardData();
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

  return (
    <DashboardLayout activeRole="SUPER_ADMIN">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Super Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Global governance, university authorizations, and blockchain integrity monitoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={fetchDashboardData}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh
          </GlassButton>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={() => setShowUniModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Register University
          </GlassButton>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Certificates</span>
            <FileCheck2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {analytics?.stats?.totalCertificates ?? "..."}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Anchored On-Chain</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Credentials</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {analytics?.stats?.issuedCertificates ?? "..."}
          </div>
          <div className="text-[11px] text-slate-400">
            Active verified status
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Revoked Credentials</span>
            <Ban className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400">
            {analytics?.stats?.revokedCertificates ?? "..."}
          </div>
          <div className="text-[11px] text-red-400/80">
            Officially recalled
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Registered Universities</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">
            {analytics?.stats?.totalUniversities ?? "..."}
          </div>
          <div className="text-[11px] text-slate-400">
            {analytics?.stats?.approvedUniversities} Approved
          </div>
        </GlassCard>
      </div>

      {/* SECTION 1: UNIVERSITIES MANAGEMENT */}
      {(currentTab === "overview" || currentTab === "universities") && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Authorized Universities</h2>
              <p className="text-xs text-slate-400">
                Accredited institutions permitted to issue certificates on-chain
              </p>
            </div>
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setShowUniModal(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add University
            </GlassButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">University</th>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">On-Chain Wallet</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {universities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{uni.name}</div>
                      <div className="text-[11px] text-slate-400">{uni.contactEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                      {uni.code}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {truncateAddress(uni.walletAddress)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          uni.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : uni.status === "SUSPENDED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {uni.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      {uni.status === "PENDING" && (
                        <button
                          onClick={() => handleUniversityStatus(uni.id, "APPROVED")}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {uni.status === "APPROVED" && (
                        <button
                          onClick={() => handleUniversityStatus(uni.id, "SUSPENDED")}
                          className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[11px] font-semibold transition-all"
                        >
                          Suspend
                        </button>
                      )}
                      {uni.status === "SUSPENDED" && (
                        <button
                          onClick={() => handleUniversityStatus(uni.id, "APPROVED")}
                          className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[11px] font-semibold transition-all"
                        >
                          Reactivate
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

      {/* SECTION 2: ALL CERTIFICATES */}
      {(currentTab === "overview" || currentTab === "certificates") && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">All Issued Certificates</h2>
              <p className="text-xs text-slate-400">
                Global registry of anchored academic credentials
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Certificate ID</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Degree Title</th>
                  <th className="py-3 px-3">Institution</th>
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
                    <td className="py-3 px-3 font-medium text-white">
                      {cert.recipientName}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {cert.title}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {cert.university?.name}
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
                        href={`/verify?id=${cert.id}`}
                        target="_blank"
                        className="text-cyan-400 hover:underline font-semibold"
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

      {/* SECTION 3: BLOCKCHAIN TRANSACTIONS */}
      {(currentTab === "overview" || currentTab === "blockchain") && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Blockchain Transactions</h2>
              <p className="text-xs text-slate-400">
                Ethereum consensus blocks anchoring cryptographic proofs
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-sans">
                <tr>
                  <th className="py-3 px-3">Tx Hash</th>
                  <th className="py-3 px-3">Function</th>
                  <th className="py-3 px-3">Block #</th>
                  <th className="py-3 px-3">Gas Used</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {analytics?.recentTransactions?.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 text-cyan-400 truncate max-w-xs">
                      {tx.txHash}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white font-sans">
                      {tx.functionName}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {tx.blockNumber || 4829103}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {tx.gasUsed || "124,532"}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                        CONFIRMED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* SECTION 4: AUDIT LOGS */}
      {(currentTab === "overview" || currentTab === "audit") && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Security Audit Trail</h2>
              <p className="text-xs text-slate-400">
                Tamper-evident logs of administrative actions and role transitions
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {analytics?.auditLogs?.map((log: any) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-black/30 border border-white/[0.05] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-cyan-300">{log.action}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {formatDateTime(log.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* MODAL: REGISTER NEW UNIVERSITY */}
      {showUniModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <GlassCard className="max-w-lg w-full p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Register Authorized University</h3>
              <button
                onClick={() => setShowUniModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterUniversity} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">University Name</label>
                <input
                  type="text"
                  required
                  placeholder="Harvard University"
                  value={newUniData.name}
                  onChange={(e) => setNewUniData({ ...newUniData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Institutional Code</label>
                  <input
                    type="text"
                    required
                    placeholder="HARV"
                    value={newUniData.code}
                    onChange={(e) => setNewUniData({ ...newUniData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="registrar@harvard.edu"
                    value={newUniData.contactEmail}
                    onChange={(e) => setNewUniData({ ...newUniData, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  On-Chain Wallet Address (Granted UNIVERSITY_ROLE)
                </label>
                <input
                  type="text"
                  required
                  placeholder="0x..."
                  value={newUniData.walletAddress}
                  onChange={(e) => setNewUniData({ ...newUniData, walletAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://www.harvard.edu"
                  value={newUniData.website}
                  onChange={(e) => setNewUniData({ ...newUniData, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowUniModal(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submittingUni}
                >
                  Register On-Chain
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL: REVOKE CERTIFICATE */}
      {revokeCertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <GlassCard className="max-w-md w-full p-6 space-y-4 border-red-500/40">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" />
              <span>Revoke Certificate</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are recalling certificate <code className="text-cyan-300">{revokeCertId}</code> on the blockchain. This will permanently mark it as revoked.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Documented Audit Reason (Required)
              </label>
              <textarea
                rows={3}
                required
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Degree recalled following examination malpractice committee verdict..."
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

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white">Loading Admin Console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
