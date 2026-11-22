import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, Lock, FileText, CheckCircle2, Globe, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Platform Mission
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          About CertiChain
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Pioneering trust and cryptographic authenticity in global education credentials.
        </p>
      </div>

      {/* Vision & Problem Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <GlassCard className="space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-2xl font-bold text-white">The Credential Forgery Crisis</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Around the world, millions of counterfeit educational diplomas, transcripts, and certificates are circulated annually. Traditional physical certificates with watermarks or basic PDFs are trivial to forge with modern graphics software.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Employers, embassies, and regulatory authorities waste weeks contacting registrar offices via slow postal mail and email inquiries, exposing organizations to fraudulent hires and massive liability.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4" glow="cyan">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-2xl font-bold text-white">The Cryptographic Solution</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            CertiChain solves this by combining mathematical hashing (SHA-256) with decentralized Ethereum smart contracts. When a university issues a certificate, the exact bytes of the document are hashed into an immutable 32-byte digital fingerprint.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Only the authorized institution’s cryptographic private key can register the certificate on-chain. Anyone anywhere can instantaneously verify the certificate in real time with 100% mathematical certainty.
          </p>
        </GlassCard>
      </div>

      {/* Security Principles */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Core Security Guarantees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <Lock className="w-6 h-6 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Zero PII On-Chain</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with GDPR and FERPA, student names, grades, and personal data are never exposed publicly on the blockchain. Only cryptographic hashes are recorded.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Canonical Hash Invariance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every certificate PDF is generated deterministically. If even one character, comma, or seal is altered, the SHA-256 fingerprint changes completely and triggers an immediate invalid status.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <Globe className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Permanent Availability</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because proof is stored on decentralized smart contracts, verification will continue working even if the issuing university's internal servers are offline or undergo migrations.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link href="/verify">
          <GlassButton variant="primary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
            Test Real-Time Verification
          </GlassButton>
        </Link>
      </div>
    </div>
  );
}
