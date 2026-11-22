import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "CertiChain | Blockchain Certificate Verification System",
  description:
    "Trust Every Certificate. Verify Everything on Blockchain. Decentralized education credential authentication platform.",
  keywords: [
    "blockchain certificate",
    "certificate verification",
    "academic fraud prevention",
    "ethereum credential",
    "decentralized verification",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080D1B] text-slate-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        {/* Ambient background glow elements */}
        <div className="fixed inset-0 bg-ambient-pattern pointer-events-none z-0" />
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow relative z-10 pt-20">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
