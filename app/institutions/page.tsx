"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Copy,
  Check,
  Award,
  Globe,
  MapPin,
  Mail,
  GraduationCap,
  Sparkles,
  Download,
  FileSpreadsheet,
  FileCode,
  Filter,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { truncateAddress } from "@/lib/utils";

export default function InstitutionsDirectoryPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");
  const [visibleCount, setVisibleCount] = useState<number>(36);
  const [loading, setLoading] = useState(true);
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data.universities || []);
      })
      .catch((err) => console.error("Error fetching universities:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(address);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const countries = ["ALL", "India", "United States", "United Kingdom", "Canada", "Australia", "Switzerland", "Singapore"];

  const filteredUniversities = universities.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      (u.address && u.address.toLowerCase().includes(q)) ||
      (u.walletAddress && u.walletAddress.toLowerCase().includes(q));

    const matchesCountry =
      selectedCountry === "ALL" ||
      (u.address && u.address.toLowerCase().includes(selectedCountry.toLowerCase()));

    return matchesSearch && matchesCountry;
  });

  const displayedUniversities = filteredUniversities.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Accredited Global Registry</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Registered Colleges & Universities
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Comprehensive open dataset of accredited universities and colleges registered with cryptographic <code className="text-cyan-300 font-mono">UNIVERSITY_ROLE</code> authority on the CertiChain blockchain registry.
        </p>
      </div>

      {/* Directory Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 space-y-1 text-center">
          <span className="text-xs text-slate-400">Database Registered</span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {universities.length}
          </div>
          <span className="text-[11px] text-emerald-400">Active On-Chain</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 text-center">
          <span className="text-xs text-slate-400">Indian Institutions</span>
          <div className="text-3xl font-extrabold font-mono text-white">478+</div>
          <span className="text-[11px] text-slate-400">IITs, NITs, Central & State Univs</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 text-center">
          <span className="text-xs text-slate-400">Global Dataset</span>
          <div className="text-3xl font-extrabold font-mono text-purple-400">10,273</div>
          <span className="text-[11px] text-slate-400">Available in Download Center</span>
        </GlassCard>

        <GlassCard className="p-4 space-y-1 text-center">
          <span className="text-xs text-slate-400">Verification Consensus</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">Zero-Trust</div>
          <span className="text-[11px] text-cyan-300">Public & Tamper-Evident</span>
        </GlassCard>
      </div>

      {/* DATASET DOWNLOAD CENTER BANNER */}
      <GlassCard className="p-6 border-cyan-500/30 bg-gradient-to-r from-blue-950/40 via-black/40 to-cyan-950/40 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Open Colleges Dataset Download Center</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Download the complete standardized datasets of Indian and international colleges with institutional codes, official domains, registrar emails, and on-chain wallet addresses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/datasets/colleges_dataset.json"
              download="certichain_global_colleges_dataset.json"
              className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Full Dataset (JSON - 10,273)</span>
            </a>

            <a
              href="/datasets/colleges_dataset.csv"
              download="certichain_colleges_dataset.csv"
              className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Full Dataset (CSV - 1.92 MB)</span>
            </a>

            <a
              href="/datasets/indian_colleges.json"
              download="certichain_indian_colleges.json"
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Indian Colleges (JSON - 478)</span>
            </a>
          </div>
        </div>
      </GlassCard>

      {/* SEARCH AND COUNTRY FILTER BAR */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by college name, code (e.g. INFY-SB, IITB, STAN), or state..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(36);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>

          <div className="text-xs text-slate-400 w-full sm:w-auto text-right">
            Showing <strong className="text-white">{displayedUniversities.length}</strong> of {filteredUniversities.length} matching colleges
          </div>
        </div>

        {/* Country Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10 text-xs">
          <span className="text-slate-400 text-xs flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setSelectedCountry(c);
                setVisibleCount(36);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCountry === c
                  ? "bg-cyan-500 text-black font-bold shadow-md"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {c === "ALL" ? `All (${universities.length})` : c}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedUniversities.map((uni) => (
          <GlassCard
            key={uni.id}
            glow="blue"
            interactive
            className="p-6 flex flex-col justify-between space-y-4 border-white/10 relative overflow-hidden"
          >
            {/* Holographic Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/10 via-blue-500/5 to-transparent pointer-events-none" />

            <div className="space-y-3">
              {/* College Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>On-Chain Authorized</span>
                </div>
              </div>

              {/* Title & Code */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                    {uni.code}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight mt-1.5 line-clamp-1" title={uni.name}>
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {uni.description || "Accredited educational institution recognized for excellence."}
                </p>
              </div>

              {/* Location & Contact */}
              <div className="space-y-1 pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                {uni.address && (
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{uni.address}</span>
                  </div>
                )}
                {uni.contactEmail && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{uni.contactEmail}</span>
                  </div>
                )}
              </div>

              {/* On-Chain Signer Wallet Address */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-[11px] font-mono flex items-center justify-between">
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-sans">Issuer Wallet:</span>
                  <span className="text-cyan-400">{truncateAddress(uni.walletAddress, 6)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyWallet(uni.walletAddress)}
                  className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Copy full wallet address"
                >
                  {copiedWallet === uni.walletAddress ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              {uni.website && (
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}

              <Link
                href="/verify"
                className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Credential</span>
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredUniversities.length && (
        <div className="text-center pt-4">
          <GlassButton
            variant="secondary"
            size="md"
            onClick={() => setVisibleCount((prev) => prev + 36)}
          >
            Load More Colleges ({filteredUniversities.length - visibleCount} remaining)
          </GlassButton>
        </div>
      )}

      {filteredUniversities.length === 0 && !loading && (
        <GlassCard className="p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Colleges Matched</h3>
          <p className="text-xs text-slate-400">
            No registered institutions match "{searchQuery}". Try searching by code (e.g. INFY-SB, MIT, STAN, IITB, HARV).
          </p>
        </GlassCard>
      )}
    </div>
  );
}
