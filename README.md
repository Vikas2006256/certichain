# CertiChain: Enterprise Blockchain-Based Certificate Verification System

> **"Trust Every Certificate. Verify Everything on Blockchain."**

CertiChain is an enterprise-grade, decentralized educational certificate authentication platform designed to eradicate diploma fraud, fake credentials, and document tampering. By combining deterministic canonical document compilation (SHA-256) with decentralized Ethereum smart contracts, CertiChain provides tamper-evident proof of academic authenticity with zero personal data (PII) exposed on the public blockchain.

---

## 🌟 Key Architecture & Security Principles

1. **Zero PII On-Chain (GDPR & FERPA Compliant)**:
   - Student names, student IDs, emails, grades, and personal descriptions are **never** stored on the public blockchain.
   - Only mathematical 32-byte SHA-256 fingerprints, issuer wallet addresses, and verification state flags are anchored on-chain.
2. **Canonical PDF Determinism**:
   - The final certificate document is generated deterministically and hashed. If even a single pixel, comma, or seal is altered, the SHA-256 fingerprint changes completely and triggers immediate verification failure.
3. **OpenZeppelin Role-Based Access Control (RBAC)**:
   - Super Admin holds `DEFAULT_ADMIN_ROLE` for onboarding and regulating institutions.
   - Verified universities hold `UNIVERSITY_ROLE` for minting credential fingerprints.
   - Students and verifiers have read-only, gas-free verification access.
4. **Permanent Availability & Zero Gas Fees for Verifiers**:
   - Employers, background check agencies, embassies, and individuals can verify credentials in milliseconds with zero gas fees.
5. **On-Chain Revocation with Audit Trails**:
   - Recalled diplomas due to academic malpractice or disciplinary reviews are permanently marked as revoked on-chain with documented audit justification.

---

## 💻 Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, Framer Motion
- **Design System**: Premium Glassmorphism UI (`backdrop-filter: blur(18px)`, deep midnight navy `#080D1B`, `#101A30`, electric blue, cyan, and purple accents)
- **Smart Contracts**: Solidity 0.8.24, OpenZeppelin Contracts (AccessControl, ReentrancyGuard), Hardhat, Ethers.js v6
- **Database & Storage**: PostgreSQL / SQLite with Prisma ORM, deterministic PDF engine (`pdf-lib`), QR code generator (`qrcode`)
- **Authentication**: JWT authentication with HTTP-only cookies and bcryptjs password hashing

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on Node v22.13.1)
- npm or pnpm

### 2. Environment Configuration
The `.env` file is pre-configured with local defaults:
```env
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
JWT_SECRET="certichain-super-secret-jwt-key-change-in-production-2026-secure"
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL="http://127.0.0.1:8545"
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
BLOCKCHAIN_SIGNER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
```

### 3. Smart Contract Compilation & Testing
Run the comprehensive Hardhat smart contract test suite:
```bash
# Compile contracts
npx hardhat compile

# Run all 17 unit tests
npx hardhat test
```

### 4. Database Initialization & Seeding
Push the Prisma schema and seed test accounts and certificates:
```bash
npx prisma db push
node prisma/seed.js
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Pre-Configured Test Accounts

The platform includes convenient one-click role demo buttons on the login page (`/auth/login`), or you can log in with:

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@certichain.io` | `AdminPassword123!` | `/admin/dashboard` |
| **Registrar (MIT)** | `registrar@mit.edu` | `UniversityPassword123!` | `/university/dashboard` |
| **Registrar (Stanford)** | `registrar@stanford.edu` | `UniversityPassword123!` | `/university/dashboard` |
| **Student (Alex)** | `alex.rivera@alumni.mit.edu` | `StudentPassword123!` | `/student/dashboard` |
| **Student (Sophia)** | `sophia.chen@alumni.stanford.edu` | `StudentPassword123!` | `/student/dashboard` |

---

## 🔍 Pre-Configured Certificates for Testing Verification

Visit `/verify` or use the hero search bar to test:

1. **Fully Verified Certificate**:
   - Certificate ID: `CERT-2026-CS-8894`
   - Recipient: Alex Morgan Rivera
   - Degree: Bachelor of Science in Computer Science (MIT)
   - Status: **VERIFIED ON-CHAIN** (100% SHA-256 match)

2. **Revoked Certificate**:
   - Certificate ID: `CERT-2026-REVOKED-001`
   - Recipient: Jonathan Sterling Doe
   - Status: **OFFICIALLY REVOKED** (Academic fraud audit justification displayed)

3. **Tampered / Forged File Test**:
   - Upload any altered PDF in the "Upload PDF" tab to observe instant hash-mismatch detection.

---

## 📂 Project Directory Structure

```
certichain/
├── app/
│   ├── layout.tsx                     # Root layout with Glassmorphism ambient glow
│   ├── page.tsx                       # High-impact Landing Page
│   ├── about/page.tsx                 # About the Platform
│   ├── how-it-works/page.tsx          # 6-step Verification Pipeline
│   ├── contact/page.tsx               # Institutional Onboarding Form
│   ├── auth/
│   │   ├── login/page.tsx             # Glassmorphism Login with fast-role pills
│   │   └── register/page.tsx          # Registration Portal
│   ├── verify/
│   │   └── page.tsx                   # Public Verification (By ID, PDF upload, QR)
│   ├── admin/dashboard/page.tsx       # Super Admin Governance Console
│   ├── university/dashboard/page.tsx  # University Registrar Issuance & Management
│   ├── student/dashboard/page.tsx     # Student Credential Portal
│   └── api/
│       ├── auth/                      # Login, register, logout, me
│       ├── verify/                    # Public verification engine
│       ├── certificates/              # Issuance, listing, revocation, PDF download
│       ├── universities/              # University registration & status toggle
│       └── analytics/                 # Platform statistics & audit logs
├── blockchain/
│   ├── contracts/
│   │   └── CertificateRegistry.sol    # Solidity Smart Contract (AccessControl, RBAC)
│   ├── scripts/
│   │   └── deploy.js                  # Deployment script exporting ABI
│   └── test/
│       └── CertificateRegistry.test.ts# 17 Hardhat unit tests
├── components/
│   ├── layout/                        # Navbar, Footer
│   ├── ui/                            # GlassCard, GlassButton
│   └── dashboard/                     # DashboardLayout, Sidebar
├── lib/
│   ├── auth.ts                        # JWT, session, bcrypt utilities
│   ├── blockchain.ts                  # Server & client Ethers.js integration
│   ├── pdf.ts                         # Deterministic PDF generator & SHA-256 hasher
│   ├── prisma.ts                      # Database client
│   └── utils.ts                       # Formatters & tailwind merge
├── prisma/
│   ├── schema.prisma                  # Database models
│   └── seed.js                        # Seed script
├── styles/
│   └── globals.css                    # Glassmorphism design system & gradients
└── package.json
```
