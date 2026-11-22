import React from "react";
import Link from "next/link";
import { 
  Building2, 
  FileCheck2, 
  Fingerprint, 
  Layers, 
  ShieldCheck, 
  Search, 
  QrCode,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function HowItWorksPage() {
  const steps = [
    {
      step: "Phase 1",
      title: "University Registrar Onboarding",
      desc: "Accredited educational institutions submit their credentials to CertiChain Super Administrators. Upon validation, the university's institutional Ethereum wallet address is granted the UNIVERSITY_ROLE on the smart contract.",
      icon: <Building2 className="w-7 h-7 text-cyan-400" />,
    },
    {
      step: "Phase 2",
      title: "Deterministic Certificate Compilation",
      desc: "The registrar inputs student records (Full Name, Student ID, Program, Degree, Honors, Date) and uploads or generates the official PDF. The system compiles the canonical immutable document file.",
      icon: <FileCheck2 className="w-7 h-7 text-blue-400" />,
    },
    {
      step: "Phase 3",
      title: "Cryptographic SHA-256 Fingerprinting",
      desc: "The file bytes are passed through a SHA-256 cryptographic digest algorithm. This creates a unique 256-bit (32 bytes) digital signature that uniquely identifies this exact document.",
      icon: <Fingerprint className="w-7 h-7 text-purple-400" />,
    },
    {
      step: "Phase 4",
      title: "Smart Contract Registration",
      desc: "The university submits an on-chain transaction calling issueCertificate(certId, docHash). The Ethereum blockchain records the transaction in an immutable block with block timestamp and issuer address.",
      icon: <Layers className="w-7 h-7 text-cyan-400" />,
    },
    {
      step: "Phase 5",
      title: "QR Code Embedding & Distribution",
      desc: "A tamper-evident QR code linked to the verification URL is permanently embedded in the certificate. The student receives their digital credential and can share it with employers.",
      icon: <QrCode className="w-7 h-7 text-blue-400" />,
    },
    {
      step: "Phase 6",
      title: "Public Mathematical Verification",
      desc: "An employer, embassy, or recruiter scans the QR code or enters the Certificate ID. CertiChain queries the on-chain smart contract, re-hashes the document, and verifies that hashes match and the certificate is unrevoked.",
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Verification Pipeline
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          How CertiChain Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          A step-by-step technical walkthrough of decentralized certificate issuance, cryptographic anchoring, and zero-trust verification.
        </p>
      </div>

      {/* Step by Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((st, idx) => (
          <GlassCard key={idx} interactive className="space-y-4 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  {st.icon}
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  {st.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{st.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographically Enforced</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Revocation Section */}
      <GlassCard className="p-8 space-y-4 border-l-4 border-l-cyan-500">
        <h3 className="text-xl font-bold text-white">What Happens If A Certificate Is Revoked?</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          If an educational institution recalls a diploma due to academic fraud, administrative error, or disciplinary actions, the authorized university wallet invokes the smart contract's <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">revokeCertificate(certId, reason)</code> function.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          The smart contract permanently sets the on-chain <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">revoked</code> flag to true along with the timestamp and revocation audit rationale. Future verification queries will immediately warn verifiers that the certificate has been officially recalled.
        </p>
      </GlassCard>

      {/* Actions */}
      <div className="text-center pt-4 flex flex-wrap justify-center gap-4">
        <Link href="/verify">
          <GlassButton variant="primary" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
            Try Verification
          </GlassButton>
        </Link>
        <Link href="/auth/login">
          <GlassButton variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Registrar Portal
          </GlassButton>
        </Link>
      </div>
    </div>
  );
}
