"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Lock,
  Cpu,
  QrCode,
  Building2,
  FileCheck2,
  CheckCircle,
  ExternalLink,
  Award,
  AlertCircle,
  Database,
  Fingerprint,
  RefreshCw,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function LandingPage() {
  const router = useRouter();
  const [searchCertId, setSearchCertId] = useState("");
  const [quickVerifyLoading, setQuickVerifyLoading] = useState(false);

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCertId.trim()) return;
    setQuickVerifyLoading(true);
    router.push(`/verify?id=${encodeURIComponent(searchCertId.trim())}`);
  };

  const stats = [
    { label: "Certificates Issued", value: "14,820+", sub: "Cryptographically anchored" },
    { label: "Public Verifications", value: "89,450+", sub: "Real-time zero-fee checks" },
    { label: "Partner Universities", value: "48+", sub: "Accredited institutions" },
    { label: "Tamper Proof Rate", value: "100%", sub: "Immutable blockchain state" },
  ];

  const features = [
    {
      title: "Blockchain Security",
      desc: "Every certificate SHA-256 fingerprint is registered on a decentralized Ethereum smart contract with zero personal data on-chain.",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      glow: "cyan" as const,
    },
    {
      title: "Instant Verification",
      desc: "Employers and agencies verify authenticity in milliseconds by querying on-chain cryptographic state or uploading the PDF.",
      icon: <Sparkles className="w-6 h-6 text-blue-400" />,
      glow: "blue" as const,
    },
    {
      title: "Zero Fraud & Forgery",
      desc: "Any pixel modification or grade tampering produces an altered cryptographic hash that fails verification immediately.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      glow: "blue" as const,
    },
    {
      title: "Dynamic QR Authentication",
      desc: "Each issued credential features a cryptographically bound QR code providing instant smartphone camera scanning and verification.",
      icon: <QrCode className="w-6 h-6 text-purple-400" />,
      glow: "purple" as const,
    },
    {
      title: "University Registrar Role",
      desc: "Multi-tier RBAC smart contract guarantees only authorized universities can mint credential proofs under cryptographic signature.",
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      glow: "blue" as const,
    },
    {
      title: "Transparent Audit Logs",
      desc: "Permanent record of issuance blocks, transaction hashes, and institution verification history available for compliance audits.",
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      glow: "cyan" as const,
    },
  ];

  const steps = [
    {
      num: "01",
      title: "University Issues Credential",
      desc: "Authorized registrar uploads academic details and compiles the canonical, immutable certificate document.",
    },
    {
      num: "02",
      title: "SHA-256 Fingerprint Generated",
      desc: "A mathematical cryptographic hash is computed from the raw document bytes, capturing every letter and stamp.",
    },
    {
      num: "03",
      title: "Blockchain Registration",
      desc: "The hash is permanently stored on the Ethereum smart contract with registrar wallet signature and block timestamp.",
    },
    {
      num: "04",
      title: "Zero-Trust Verification",
      desc: "Anyone scans the QR code or enters the Certificate ID to independently verify against the decentralized contract.",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-300 text-xs font-medium tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>CertiChain Protocol 2.0 • Web3 Educational Trust</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Trust Every Certificate. <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Verify Everything
              </span>{" "}
              on Blockchain.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              CertiChain empowers educational institutions to issue tamper-evident digital certificates and enables employers, embassies, and individuals to independently verify their authenticity through decentralized blockchain consensus.
            </p>

            {/* Search / Quick Verification Widget */}
            <form
              onSubmit={handleQuickVerify}
              className="p-2 rounded-2xl glass-panel border border-white/10 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
            >
              <div className="relative flex-grow flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter Certificate ID (e.g. CERT-2026-INFY-SB-1001 or CERT-2026-CS-8894)..."
                  value={searchCertId}
                  onChange={(e) => setSearchCertId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <GlassButton
                type="submit"
                variant="primary"
                size="md"
                loading={quickVerifyLoading}
                icon={<ShieldCheck className="w-4 h-4" />}
                className="shrink-0"
              >
                Verify Now
              </GlassButton>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/verify">
                <GlassButton variant="primary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
                  Verify Certificate
                </GlassButton>
              </Link>
              <Link href="/how-it-works">
                <GlassButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Explore Platform
                </GlassButton>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Gas Fee for Verifiers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Immutable SHA-256 Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>GDPR & PII Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating 3D-effect Glass Certificate Preview */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Back Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-purple-600/30 rounded-3xl blur-2xl -z-10" />

            <div className="w-full max-w-md p-6 sm:p-7 rounded-2xl glass-card-interactive border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              {/* Subtle holographic top corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/20 via-blue-500/10 to-transparent pointer-events-none" />

              {/* Certificate Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <Award className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Standard Institute of Technology
                    </h3>
                    <p className="text-[10px] text-slate-400">Accredited Member #UNI-8842</p>
                  </div>
                </div>

                {/* Status Verified Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Verified On-Chain</span>
                </div>
              </div>

              {/* Certificate Body Preview */}
              <div className="py-6 space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-[11px] uppercase tracking-widest text-slate-400">
                    Official Degree of
                  </span>
                  <h4 className="text-xl font-bold text-white tracking-wide">
                    Bachelor of Science in Computer Science
                  </h4>
                  <p className="text-xs text-blue-300 font-medium">Summa Cum Laude • GPA 3.96</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-left space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Recipient:</span>
                    <span className="font-semibold text-slate-200">Alex Morgan Rivera</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Certificate ID:</span>
                    <span className="font-mono text-cyan-400">CERT-2026-CS-8894</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">SHA-256 Digest:</span>
                    <span className="font-mono text-[11px] text-slate-300">0x7f83b165...9482ec</span>
                  </div>
                </div>

                {/* Simulated Blockchain Proof Bar */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                    Block #4829103
                  </span>
                  <span className="text-emerald-400 font-medium">100% Hash Match</span>
                </div>
              </div>

              {/* Footer with QR Code Preview */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-md flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400">Scan to independently verify</div>
                    <div className="text-xs font-mono text-cyan-300">certichain.io/verify</div>
                  </div>
                </div>
                <Link
                  href="/verify?id=CERT-2026-CS-8894"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all flex items-center gap-1"
                >
                  <span>Test Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC STATISTICS COUNTER SECTION */}
      <section className="border-y border-white/[0.08] bg-[#0A1022]/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-400 font-mono">
                {s.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">{s.label}</div>
              <div className="text-xs text-slate-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Enterprise Architecture
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed for Absolute Verifiability
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminating document fraud, manual embassy verifications, and slow registrar lookups with decentralized trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <GlassCard key={idx} glow={f.glow} interactive className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shadow-inner">
                {f.icon}
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">{f.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4-STEP HOW IT WORKS SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Lifecycle Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            How CertiChain Works
          </h3>
          <p className="text-slate-300 text-sm">
            From university issuance to global verification in four cryptographic steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-white/[0.08] relative space-y-3"
            >
              <div className="text-4xl font-extrabold font-mono text-cyan-400/40">
                {st.num}
              </div>
              <h4 className="text-base font-bold text-white">{st.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden text-center space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Protect Academic Integrity?
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join leading institutions, universities, and enterprise verification partners on the CertiChain network.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/verify">
              <GlassButton variant="primary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
                Verify a Certificate
              </GlassButton>
            </Link>
            <Link href="/contact">
              <GlassButton variant="secondary" size="lg" icon={<Building2 className="w-5 h-5" />}>
                Register Your Institution
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
