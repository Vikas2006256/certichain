"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Fingerprint,
  Cpu,
  QrCode,
  Building2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Award,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

interface Scene {
  id: number;
  title: string;
  duration: number; // in seconds
  caption: string;
  narration: string;
  stage: "crisis" | "onboarding" | "hashing" | "blockchain" | "verification" | "tamper";
}

const scenes: Scene[] = [
  {
    id: 1,
    title: "The Crisis of Credential Forgery",
    duration: 7,
    caption:
      "Millions of fake diplomas and forged certificates circulate worldwide every year, damaging organizational trust and academic integrity.",
    narration:
      "Traditional paper and PDF certificates are easily forged with modern graphics software. Employers and background check agencies waste weeks waiting for slow registrar responses.",
    stage: "crisis",
  },
  {
    id: 2,
    title: "Institutional Onboarding (RBAC)",
    duration: 8,
    caption:
      "Accredited universities and learning platforms like Infosys Springboard, MIT, and Oxford are cryptographically authorized on-chain.",
    narration:
      "CertiChain uses OpenZeppelin Role-Based Access Control. Only authorized educational institutions holding the UNIVERSITY_ROLE can sign and register certificate fingerprints.",
    stage: "onboarding",
  },
  {
    id: 3,
    title: "Canonical Compilation & SHA-256 Hashing",
    duration: 8,
    caption:
      "The certificate is generated deterministically and converted into a permanent 32-byte cryptographic SHA-256 digest. Zero PII on-chain.",
    narration:
      "Student records are compiled into a canonical immutable PDF. Its raw bytes are hashed into a unique 32-byte fingerprint. Personal data is never stored on the public blockchain.",
    stage: "hashing",
  },
  {
    id: 4,
    title: "Ethereum Smart Contract Anchoring",
    duration: 8,
    caption:
      "The certificate fingerprint is permanently sealed inside the Ethereum CertificateRegistry contract with registrar signature and block timestamp.",
    narration:
      "The registrar broadcasts an on-chain transaction calling issueCertificate. Ethereum mines the transaction, permanently locking the hash and timestamp into an immutable consensus block.",
    stage: "blockchain",
  },
  {
    id: 5,
    title: "Public Instant Verification & QR Scan",
    duration: 9,
    caption:
      "Anyone scans the certificate's embedded QR code or enters the Certificate ID to verify against the smart contract in milliseconds.",
    narration:
      "Verifiers, recruiters, or embassies can scan the embedded QR code or upload the PDF. CertiChain queries the on-chain registry and confirms 100% mathematical authenticity with zero gas fees.",
    stage: "verification",
  },
  {
    id: 6,
    title: "Tamper Detection & Revocation Safeguards",
    duration: 8,
    caption:
      "Any pixel modification changes the SHA-256 hash completely, triggering instant tamper alerts. Recalled credentials show revocation reasons.",
    narration:
      "If a single letter or grade is altered, the recalculated hash fails immediately. If an institution revokes a credential, the smart contract flags it with a full documented audit rationale.",
    stage: "tamper",
  },
];

export default function DemoVideoPage() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100%
  const [interactiveTamperActive, setInteractiveTamperActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentScene = scenes[currentSceneIdx];

  // Speech narration
  useEffect(() => {
    if (!soundEnabled || !isPlaying || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentScene.narration);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSceneIdx, soundEnabled, isPlaying, playbackSpeed]);

  // Video Timeline & Progress Engine
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const durationMs = (currentScene.duration * 1000) / playbackSpeed;
    const intervalMs = 50;
    const step = (intervalMs / durationMs) * 100;

    progressIntervalRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          if (currentSceneIdx < scenes.length - 1) {
            setCurrentSceneIdx((idx) => idx + 1);
          } else {
            // Loop or stop
            setIsPlaying(false);
          }
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, currentSceneIdx, playbackSpeed]);

  const handleSceneSelect = (idx: number) => {
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
    setInteractiveTamperActive(false);
  };

  const handleRestart = () => {
    setCurrentSceneIdx(0);
    setSceneProgress(0);
    setIsPlaying(true);
    setInteractiveTamperActive(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Video Demonstration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How CertiChain Works: The Full Lifecycle
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          Watch how educational institutions register on-chain, issue deterministic SHA-256 credentials, and empower employers to verify authenticity in real-time.
        </p>
      </div>

      {/* CINEMATIC VIDEO PLAYER SCREEN */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#050914] shadow-[0_0_60px_rgba(34,211,238,0.15)] flex flex-col aspect-[16/9] min-h-[460px] sm:min-h-[520px]">
        {/* Animated Background Mesh & Gradients */}
        <div className="absolute inset-0 bg-ambient-pattern opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Video Header Overlay */}
        <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#080D1B] rounded-[7px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                CertiChain Protocol Demo
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Scene {currentScene.id} of {scenes.length}: {currentScene.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE DEMO SIMULATOR</span>
            </span>
          </div>
        </div>

        {/* MAIN VISUAL STAGE */}
        <div className="relative z-10 flex-grow flex items-center justify-center p-6 text-center">
          {/* SCENE 1: THE CRISIS */}
          {currentScene.stage === "crisis" && (
            <div className="space-y-6 max-w-lg mx-auto animate-fade-in">
              <div className="relative w-72 h-44 mx-auto p-4 rounded-xl bg-white/5 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)] flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-red-500/20 pb-2">
                  <span className="text-[11px] font-bold text-red-400">UNVERIFIED PAPER CERTIFICATE</span>
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="space-y-1 text-center py-2">
                  <span className="text-xs text-slate-400">Forged Degree Awarded To:</span>
                  <h4 className="text-base font-bold text-red-300 line-through">Jonathan Doe</h4>
                  <span className="text-[10px] text-amber-400 block">Photoshop Edited • Watermark Copied</span>
                </div>
                <div className="text-[10px] text-red-400/80 bg-red-950/40 p-1.5 rounded border border-red-500/20">
                  ❌ No Blockchain Record • Impossible to verify offline
                </div>
              </div>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Physical seals and PDFs are easily cloned. CertiChain replaces vulnerability with mathematical consensus.
              </p>
            </div>
          )}

          {/* SCENE 2: ONBOARDING */}
          {currentScene.stage === "onboarding" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "Infosys Springboard", code: "INFY-SB", addr: "0x68b3...5Fc45" },
                  { name: "MIT", code: "MIT", addr: "0x7099...dc79C8" },
                  { name: "Stanford", code: "STAN", addr: "0x3C44...FA4293" },
                  { name: "IIT Bombay", code: "IITB", addr: "0x1CBD...27076B" },
                ].map((inst, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-left space-y-1.5 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-300">{inst.code}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{inst.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{inst.addr}</div>
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Smart Contract Role Granted: UNIVERSITY_ROLE</span>
              </div>
            </div>
          )}

          {/* SCENE 3: HASHING */}
          {currentScene.stage === "hashing" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* PDF Document */}
                <div className="w-48 p-4 rounded-xl bg-white/10 border border-cyan-400/40 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                    <span>Canonical PDF</span>
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-white font-medium">Ananya Verma</div>
                  <div className="text-[10px] text-slate-400">Infosys Springboard</div>
                  <div className="text-[10px] text-slate-500">Bytes: 4,096 B</div>
                </div>

                <div className="flex flex-col items-center text-cyan-400 animate-pulse">
                  <span className="text-xs font-mono font-bold">SHA-256</span>
                  <ArrowRight className="w-5 h-5 hidden sm:block" />
                  <span className="text-[10px] text-slate-400">One-Way Function</span>
                </div>

                {/* Cryptographic Digest */}
                <div className="w-56 p-4 rounded-xl bg-black/60 border border-purple-500/40 text-left space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
                    <span>32-Byte Hash</span>
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-cyan-400 break-all">
                    0xa446f5be34f6...af31e7f89cc7cd
                  </div>
                  <div className="text-[10px] text-emerald-400">✔ ZERO Personal Data</div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 4: BLOCKCHAIN ANCHORING */}
          {currentScene.stage === "blockchain" && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="p-6 rounded-2xl bg-black/60 border border-cyan-500/40 space-y-4 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Ethereum Block #4835120
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                    CONFIRMED
                  </span>
                </div>

                <div className="text-left font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Function:</span>
                    <span className="text-white font-semibold">issueCertificate(certId, hash)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Issuer Wallet:</span>
                    <span className="text-cyan-300">0x68b3...5Fc45 (Infosys Springboard)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gas Used:</span>
                    <span className="text-slate-300">128,450 (Mined in 12s)</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Permanently written to the blockchain. Even if servers go down, the proof remains eternal.
              </p>
            </div>
          )}

          {/* SCENE 5: VERIFICATION */}
          {currentScene.stage === "verification" && (
            <div className="space-y-5 max-w-lg mx-auto">
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 space-y-3 shadow-[0_0_40px_rgba(34,197,94,0.2)] text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                      Certificate Successfully Verified
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">32ms</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Ananya Verma</h4>
                  <p className="text-xs text-cyan-300">
                    Infosys Certified Java Full-Stack & Cloud Microservices Specialist
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Infosys Springboard Digital Academy • Conferred on Sept 10, 2024
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-center text-[11px] font-mono text-slate-300">
                  <span>ID: CERT-2026-INFY-SB-1001</span>
                  <span className="text-emerald-400 font-bold">100% Hash Match</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 6: TAMPER / REVOCATION */}
          {currentScene.stage === "tamper" && (
            <div className="space-y-5 max-w-lg mx-auto">
              {interactiveTamperActive ? (
                <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/60 space-y-3 shadow-[0_0_40px_rgba(245,158,11,0.2)] text-left animate-shake">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Tamper Alert: Hash Mismatch Detected!
                    </span>
                  </div>
                  <p className="text-xs text-slate-200">
                    A bad actor altered 1 character in the certificate PDF. The recalculated SHA-256 fingerprint does not match the blockchain registry!
                  </p>
                  <div className="text-[11px] font-mono p-2 rounded bg-black/60 text-red-400">
                    Expected: 0xa446f5... <br />
                    Calculated: 0x99281a... [MISMATCH]
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/50 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Status: Officially Revoked On-Chain
                    </span>
                  </div>
                  <div className="text-xs text-slate-200">
                    Certificate <code className="text-cyan-300">CERT-2026-REVOKED-001</code> was recalled by the Academic Disciplinary Committee.
                  </div>
                  <div className="p-2.5 rounded bg-black/60 text-[11px] text-red-300 border border-red-500/20 italic">
                    "Falsification of academic admission credentials and examination misconduct."
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setInteractiveTamperActive(!interactiveTamperActive)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all border border-white/15"
                >
                  {interactiveTamperActive ? "Show Revocation Demo" : "Simulate File Tampering"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM VIDEO CAPTIONS & CONTROLS */}
        <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-4">
          {/* Synchronized Subtitles / Captions */}
          <div className="text-center px-4">
            <span className="inline-block px-4 py-2 rounded-xl bg-black/70 border border-white/10 text-xs sm:text-sm text-slate-200 font-medium max-w-3xl shadow-lg backdrop-blur-md">
              {currentScene.caption}
            </span>
          </div>

          {/* Timeline Scrubber Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
              {scenes.map((scene, idx) => {
                let fillPercent = 0;
                if (idx < currentSceneIdx) fillPercent = 100;
                else if (idx === currentSceneIdx) fillPercent = sceneProgress;

                return (
                  <div
                    key={scene.id}
                    onClick={() => handleSceneSelect(idx)}
                    className="flex-1 h-full cursor-pointer relative border-r border-black/40 group"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-75"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Scene Markers */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => handleSceneSelect(idx)}
                  className={`hover:text-cyan-300 transition-colors ${
                    idx === currentSceneIdx ? "text-cyan-400 font-bold" : ""
                  }`}
                >
                  {scene.id}. {scene.stage}
                </button>
              ))}
            </div>
          </div>

          {/* Video Control Buttons */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {/* Play/Pause & Restart */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart Video from Beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  soundEnabled
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
                title="Toggle Voice Narration"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundEnabled ? "Voice Narration On" : "Voice Off"}</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Speed:</span>
              {[1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed as any)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    playbackSpeed === speed
                      ? "bg-cyan-500 text-black shadow-md"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BELOW VIDEO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <GlassCard className="p-5 space-y-2 text-center" glow="cyan">
          <ShieldCheck className="w-6 h-6 text-cyan-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Test Live Verification</h4>
          <p className="text-xs text-slate-400">
            Verify the Infosys Springboard certificate (Ananya Verma) live on-chain.
          </p>
          <Link href="/verify?id=CERT-2026-INFY-SB-1001" className="block pt-2">
            <GlassButton variant="primary" size="sm" className="w-full">
              Verify Infosys Springboard
            </GlassButton>
          </Link>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 text-center" glow="blue">
          <Building2 className="w-6 h-6 text-blue-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Browse 16 Colleges</h4>
          <p className="text-xs text-slate-400">
            Explore MIT, Stanford, Oxford, IIT Bombay, and registered institutions.
          </p>
          <Link href="/institutions" className="block pt-2">
            <GlassButton variant="secondary" size="sm" className="w-full">
              View Colleges Directory
            </GlassButton>
          </Link>
        </GlassCard>

        <GlassCard className="p-5 space-y-2 text-center" glow="purple">
          <Award className="w-6 h-6 text-purple-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Registrar & Student Portals</h4>
          <p className="text-xs text-slate-400">
            Log in with 1-click test roles to issue credentials and view dashboards.
          </p>
          <Link href="/auth/login" className="block pt-2">
            <GlassButton variant="outline" size="sm" className="w-full">
              Open Login Portal
            </GlassButton>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
