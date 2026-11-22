import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink, Github, Twitter, Linkedin, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#060A16] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <div className="w-full h-full bg-[#080D1B] rounded-[11px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Certi<span className="text-cyan-400 font-extrabold">Chain</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Decentralized educational certificate authentication platform. Eliminating credential fraud worldwide with cryptographic SHA-256 anchoring and public blockchain immutability.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Smart Contract Audited</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-PII On-Chain</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/verify" className="hover:text-cyan-400 transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-cyan-400 transition-colors">
                  Institution Login
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-cyan-400 transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Trust & Tech
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span>Solidity Smart Contracts</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400">OpenZeppelin RBAC</span>
              </li>
              <li>
                <span className="text-slate-400">Ethereum & Sepolia</span>
              </li>
              <li>
                <span className="text-slate-400">Deterministic SHA-256</span>
              </li>
              <li>
                <span className="text-slate-400">Tamper-Evident Logs</span>
              </li>
            </ul>
          </div>

          {/* Institutional Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Institutions
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accredited universities and certification bodies can request registrar access.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Onboard Your University</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <div className="pt-3">
              <span className="text-[11px] font-mono text-slate-500">
                Network: Ethereum / Sepolia
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} CertiChain Protocol. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Security Disclosures
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
