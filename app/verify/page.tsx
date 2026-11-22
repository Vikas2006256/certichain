"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Upload,
  QrCode,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Fingerprint,
  Building2,
  Calendar,
  Award,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { truncateAddress, formatDate, formatDateTime } from "@/lib/utils";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<"id" | "file" | "qr">("id");
  const [certId, setCertId] = useState(initialId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  useEffect(() => {
    if (initialId) {
      setCertId(initialId);
      performVerification(initialId);
    }
  }, [initialId]);

  const performVerification = async (idToVerify?: string, fileToVerify?: File) => {
    setLoading(true);
    setVerificationResult(null);

    try {
      let res;
      if (fileToVerify) {
        const formData = new FormData();
        if (idToVerify) formData.append("certId", idToVerify);
        formData.append("file", fileToVerify);
        formData.append("method", "FILE_UPLOAD");

        res = await fetch("/api/verify", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            certId: (idToVerify || certId).trim(),
            method: activeTab === "qr" ? "QR_SCAN" : "SEARCH",
          }),
        });
      }

      const data = await res.json();
      setVerificationResult(data);
    } catch (err: any) {
      setVerificationResult({
        verified: false,
        status: "ERROR",
        message: "Failed to connect to verification network. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    performVerification(certId.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      performVerification(certId, file);
    }
  };

  const copyToClipboard = (text: string, type: "hash" | "tx") => {
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Decentralized Proof Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Public Certificate Verification
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Verify academic credentials against Ethereum smart contract state. Zero personal data on-chain, 100% cryptographic consensus.
        </p>
      </div>

      {/* Verification Mode Selector */}
      <GlassCard className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-black/30 border border-white/10 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("id")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "id"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>By ID</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "file"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "qr"
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Tab 1: Certificate ID Search */}
        {activeTab === "id" && (
          <form onSubmit={handleIdSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter unique Certificate ID (e.g. CERT-2026-CS-8894)..."
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-input text-sm font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Quick sample chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span>Try sample:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCertId("CERT-2026-INFY-SB-1001");
                    performVerification("CERT-2026-INFY-SB-1001");
                  }}
                  className="px-2 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-cyan-300 font-mono text-[11px] transition-all border border-blue-500/40"
                >
                  CERT-2026-INFY-SB-1001 (Infosys Springboard)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCertId("CERT-2026-CS-8894");
                    performVerification("CERT-2026-CS-8894");
                  }}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-cyan-300 font-mono text-[11px] transition-all"
                >
                  CERT-2026-CS-8894 (MIT)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCertId("CERT-2026-REVOKED-001");
                    performVerification("CERT-2026-REVOKED-001");
                  }}
                  className="px-2 py-1 rounded bg-red-500/15 hover:bg-red-500/25 text-red-300 font-mono text-[11px] transition-all"
                >
                  CERT-2026-REVOKED-001 (Revoked)
                </button>
              </div>

              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                loading={loading}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Verify Authenticity
              </GlassButton>
            </div>
          </form>
        )}

        {/* Tab 2: Upload PDF Document */}
        {activeTab === "file" && (
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <label className="border-2 border-dashed border-white/20 hover:border-cyan-400/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05]">
              <Upload className="w-10 h-10 text-cyan-400 mb-3 animate-bounce" />
              <span className="text-sm font-semibold text-white">
                {selectedFile ? selectedFile.name : "Click to select certificate PDF"}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                Computes canonical SHA-256 and matches against Ethereum registry
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {selectedFile && (
              <div className="text-xs text-cyan-300 font-mono flex items-center justify-center gap-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: QR Code Verification */}
        {activeTab === "qr" && (
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="p-6 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <QrCode className="w-12 h-12 text-cyan-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Camera QR Scanner</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan the QR code printed on the physical or digital certificate with your smartphone camera to instantly verify.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCertId("CERT-2026-CS-8894");
                    performVerification("CERT-2026-CS-8894");
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40"
                >
                  Simulate QR Camera Scan (CERT-2026-CS-8894)
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Loading Animation Indicator */}
      {loading && (
        <div className="p-8 rounded-2xl glass-card text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">Querying Ethereum Smart Contract...</h4>
            <p className="text-xs text-slate-400 font-mono">
              Comparing SHA-256 document fingerprint with on-chain cryptographic registry
            </p>
          </div>
        </div>
      )}

      {/* VERIFICATION RESULT SCREEN */}
      {verificationResult && !loading && (
        <div className="space-y-6">
          {/* 1. SUCCESS: FULLY VERIFIED */}
          {verificationResult.verified && (
            <GlassCard className="p-6 sm:p-8 space-y-8 border-emerald-500/40 shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Verified Header Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] shrink-0">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                        Cryptographic Proof Valid
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Certificate Successfully Verified
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/api/certificates/${verificationResult.certificate.id}/download`}
                    target="_blank"
                  >
                    <GlassButton variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
                      Download Official PDF
                    </GlassButton>
                  </Link>
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-cyan-400" /> Academic Credential Details
                  </h3>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block">Student Full Name</span>
                      <span className="text-lg font-bold text-white">
                        {verificationResult.certificate.recipientName}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block">Degree / Award Title</span>
                      <span className="font-semibold text-cyan-300">
                        {verificationResult.certificate.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-xs text-slate-400 block">Issuing Institution</span>
                        <span className="font-medium text-slate-200">
                          {verificationResult.certificate.universityName}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Issue Date</span>
                        <span className="font-medium text-slate-200">
                          {formatDate(verificationResult.certificate.issueDate)}
                        </span>
                      </div>
                    </div>

                    {verificationResult.certificate.grade && (
                      <div>
                        <span className="text-xs text-slate-400 block">Academic Distinction</span>
                        <span className="text-emerald-400 font-medium">
                          {verificationResult.certificate.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Blockchain Proof Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" /> Decentralized Blockchain Consensus
                  </h3>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-sans">Certificate Identifier</span>
                      <span className="text-cyan-400 font-semibold">
                        {verificationResult.certificate.id}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-sans">SHA-256 Fingerprint (32 Bytes)</span>
                        <button
                          onClick={() => copyToClipboard(verificationResult.certificate.certHash, "hash")}
                          className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-sans text-[10px]"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHash ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <span className="text-slate-300 break-all text-[11px]">
                        {verificationResult.certificate.certHash}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-sans">Transaction Hash</span>
                        <button
                          onClick={() => copyToClipboard(verificationResult.certificate.txHash, "tx")}
                          className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-sans text-[10px]"
                        >
                          {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTx ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <span className="text-slate-300 break-all text-[11px]">
                        {verificationResult.certificate.txHash || "0x4e07b94998797f8647e300295757099999485a0ef8e0030be9ef7439246160e2"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 font-sans">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Blockchain Network</span>
                        <span className="text-slate-200 font-medium">Ethereum (Hardhat / Sepolia)</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Verified Timestamp</span>
                        <span className="text-emerald-400 font-medium">
                          {formatDateTime(verificationResult.verificationTimestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code & Share Card */}
              {verificationResult.certificate.qrCodeDataUrl && (
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={verificationResult.certificate.qrCodeDataUrl}
                      alt="Certificate Verification QR"
                      className="w-16 h-16 rounded-lg bg-white p-1"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Official Verification QR</span>
                      <span className="text-xs text-slate-400">
                        Scan with any smartphone or share link with recruiters
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Public verification link copied to clipboard!");
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Verification URL</span>
                  </button>
                </div>
              )}
            </GlassCard>
          )}

          {/* 2. FAILURE: REVOKED */}
          {verificationResult.status === "REVOKED" && (
            <GlassCard className="p-8 space-y-6 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase">
                    Status: Officially Revoked
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Certificate Has Been Recalled
                  </h2>
                  <p className="text-sm text-slate-300">
                    This credential was originally registered but has been formally revoked by the issuing institution or academic governing body.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2 text-sm">
                <span className="text-xs font-semibold text-red-300 uppercase tracking-wider block">
                  Documented Revocation Audit Rationale:
                </span>
                <p className="text-white font-medium">
                  "{verificationResult.certificate?.revocationReason || "Administrative recall following academic integrity review."}"
                </p>
                {verificationResult.certificate?.revokedAt && (
                  <span className="text-xs text-red-400 block pt-1">
                    Revoked on: {formatDateTime(verificationResult.certificate.revokedAt)}
                  </span>
                )}
              </div>
            </GlassCard>
          )}

          {/* 3. FAILURE: HASH MISMATCH (FORGERY ATTEMPT) */}
          {verificationResult.status === "HASH_MISMATCH" && (
            <GlassCard className="p-8 space-y-6 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase">
                    Tamper Alert: Hash Mismatch
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Document Cryptographic Integrity Failed
                  </h2>
                  <p className="text-sm text-slate-300">
                    The SHA-256 fingerprint generated from the uploaded document does NOT match the cryptographic fingerprint registered on the blockchain. The file has been edited, tampered with, or forged.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* 4. FAILURE: NOT FOUND */}
          {verificationResult.status === "NOT_FOUND" && (
            <GlassCard className="p-8 space-y-6 border-white/20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h2 className="text-2xl font-extrabold text-white">
                  Certificate Record Not Found
                </h2>
                <p className="text-sm text-slate-400">
                  No certificate matching the identifier <code className="text-cyan-300">{certId}</code> exists on the CertiChain decentralized registry. Please double-check the ID or verify with the issuing registrar.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
