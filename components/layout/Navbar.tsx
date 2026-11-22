"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  Layers, 
  Info, 
  Mail, 
  LogIn, 
  ArrowRight,
  Sparkles,
  Wallet,
  Building2,
  Play
} from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { truncateAddress } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: <Layers className="w-4 h-4" /> },
    { name: "Video Demo", href: "/demo", icon: <Play className="w-4 h-4 text-cyan-400" /> },
    { name: "Colleges", href: "/institutions", icon: <Building2 className="w-4 h-4" /> },
    { name: "Verify Certificate", href: "/verify", icon: <Search className="w-4 h-4" /> },
    { name: "How It Works", href: "/how-it-works", icon: <Sparkles className="w-4 h-4" /> },
    { name: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletConnected(true);
        }
      } catch (err) {
        console.error("MetaMask connection error", err);
      }
    } else {
      // Mock / fallback simulated connect for testing
      setWalletAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      setWalletConnected(true);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080D1B]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all">
              <div className="w-full h-full bg-[#080D1B] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Certi<span className="text-cyan-400 font-extrabold">Chain</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold -mt-1">
                Decentralized Proof
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-cyan-300 bg-white/[0.08] shadow-[0_0_15px_rgba(34,211,238,0.15)] border border-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wallet Connect Status */}
            <button
              onClick={connectWallet}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                walletConnected
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                  : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20"
              }`}
              title="Connect Web3 Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-cyan-400" />
              <span>{walletConnected && walletAddress ? truncateAddress(walletAddress) : "Connect Wallet"}</span>
            </button>

            {/* Login Link */}
            <Link href="/auth/login">
              <GlassButton variant="secondary" size="sm" icon={<LogIn className="w-3.5 h-3.5" />}>
                Login
              </GlassButton>
            </Link>

            {/* Launch App / Verify CTA */}
            <Link href="/verify">
              <GlassButton variant="primary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}>
                Verify Now
              </GlassButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080D1B]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    isActive
                      ? "text-cyan-400 bg-white/[0.08] border border-cyan-500/20"
                      : "text-slate-300 hover:bg-white/[0.04]"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={connectWallet}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono bg-white/[0.04] border border-white/10 text-slate-300"
            >
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>{walletConnected && walletAddress ? truncateAddress(walletAddress) : "Connect Web3 Wallet"}</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton variant="secondary" size="md" className="w-full">
                  Sign In
                </GlassButton>
              </Link>
              <Link href="/verify" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton variant="primary" size="md" className="w-full">
                  Verify Now
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
