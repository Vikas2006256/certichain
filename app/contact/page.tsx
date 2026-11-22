"use client";

import React, { useState } from "react";
import { Mail, Building2, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "Registrar / Academic Office",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Institutional Onboarding
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Connect With CertiChain
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Ready to onboard your university, college, or accreditation board onto the blockchain verification registry? Contact our governance team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="space-y-6">
            <h3 className="text-xl font-bold text-white">Institutional Support</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We provide turnkey registrar onboarding, custom ERP/SIS integrations (Banner, PeopleSoft, Canvas), and enterprise key management.
            </p>

            <div className="space-y-4 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Registrar Inquiry</span>
                  <span className="font-medium text-white">registrar@certichain.io</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Governance Office</span>
                  <span className="font-medium text-white">Zurich, Switzerland & San Francisco, USA</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Verification Hotline</span>
                  <span className="font-medium text-white">+1 (800) 555-CERTI</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for reaching out. Our accreditation and onboarding team will review your institution credentials and respond within 24 business hours.
                </p>
                <GlassButton
                  variant="secondary"
                  size="md"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </GlassButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white">Request Institution Onboarding</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Eleanor Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.vance@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">University / Institution Name</label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="State Polytechnic University"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Department / Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    >
                      <option value="Registrar / Academic Office" className="bg-[#101A30]">Registrar / Academic Office</option>
                      <option value="Dean / Provost" className="bg-[#101A30]">Dean / Provost</option>
                      <option value="IT & Systems Architecture" className="bg-[#101A30]">IT & Systems Architecture</option>
                      <option value="Employer / Verification Agency" className="bg-[#101A30]">Employer / Verification Agency</option>
                      <option value="Other" className="bg-[#101A30]">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Message / Integration Scope</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="We issue approximately 5,000 diplomas annually and are seeking to integrate automated blockchain anchoring..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <GlassButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={<Send className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  Submit Inquiry
                </GlassButton>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
