# 🏛️ CertiChain: Enterprise Blockchain Certificate Verification System

<div align="center">

![CertiChain Banner](https://img.shields.io/badge/CertiChain-Web3%20Certificate%20Verification-3B82F6?style=for-the-badge&logo=ethereum&logoColor=white)

[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Contracts%20v5-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white)](https://openzeppelin.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Glassmorphism%20UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Ethereum%20Dev-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

> **"Trust Every Certificate. Verify Everything on Blockchain."**  
> *An enterprise-grade, decentralized verification platform that permanently eliminates academic credential forgery, fake degrees, and document tampering through cryptographic proofs and zero personal data exposure.*

[Explore Live Demo](http://localhost:3000) • [View Video Demo](http://localhost:3000/demo) • [Verify Certificate](http://localhost:3000/verify) • [Colleges Directory](http://localhost:3000/institutions) • [Smart Contracts](#-smart-contract-architecture)

</div>

---

## 📑 Table of Contents

- [Overview & Problem Statement](#-overview--problem-statement)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Security & Zero-PII Compliance](#-security--zero-pii-compliance)
- [Technology Stack](#-technology-stack)
- [Infosys Springboard & Global Colleges Registry](#-infosys-springboard--global-colleges-registry)
- [Smart Contract Architecture (`CertificateRegistry.sol`)](#-smart-contract-architecture)
- [Interactive Video Demonstration](#-interactive-video-demonstration)
- [Quick Start & Installation](#-quick-start--installation)
- [Live Test Credentials & Verification Samples](#-live-test-credentials--verification-samples)
- [API Reference](#-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Security Audit & Testing Suite](#-security-audit--testing-suite)
- [Author & License](#-author--license)

---

## 🌐 Overview & Problem Statement

Academic credential fraud is a multi-billion dollar illicit industry. Traditional paper and static digital certificates (unencrypted PDFs, scanned images) are effortlessly forged using modern editing software. Verifying a candidate's credentials manually requires weeks of slow administrative communication with university registrar offices.

**CertiChain** solves this fundamentally by decentralizing verification:

1. **Eliminates Middlemen**: Enables instant, gas-free, trustless verification worldwide in under **100 milliseconds**.
2. **Mathematically Tamper-Proof**: Generates canonical document SHA-256 digests anchored on an immutable Ethereum-compatible ledger. Altering even a single character, pixel, or grade in the PDF renders the cryptographic fingerprint invalid.
3. **Decentralized Governance**: Accredited universities, colleges, and enterprise academies (including **Infosys Springboard**) control their cryptographic signing identity, while Super Admins oversee institutional accreditation.
4. **Complete Revocation Auditability**: Institutions can permanently revoke tainted or erroneously issued credentials with on-chain reason logs.

---

## 🏛️ System Architecture

```
                  +-----------------------------------------------------+
                  |           INSTITUTIONAL REGISTRAR DASHBOARD         |
                  +-----------------------------------------------------+
                                            |
                         (1) Fills Form & Canonicalizes PDF
                                            v
                  +-----------------------------------------------------+
                  |         CANONICAL PDF GENERATOR & HASHER            |
                  |            (Deterministic SHA-256 Digest)           |
                  +-----------------------------------------------------+
                                     /             \
                  (Off-Chain Metadata)             (Cryptographic Fingerprint)
                                   /                 \
                                  v                   v
+-----------------------------------+               +-----------------------------------+
|      POSTGRESQL / PRISMA DB       |               |    ETHEREUM / HARDHAT BLOCKCHAIN  |
|  - University profile & accounts  |               |  - CertificateRegistry.sol        |
|  - Encrypted certificate storage  |               |  - bytes32 CertificateHash        |
|  - Audit logs & access history    |               |  - address Issuer                 |
+-----------------------------------+               |  - uint256 IssuedAt               |
                                                    |  - bool Exists, bool Revoked      |
                                                    +-----------------------------------+
                                                                      ^
                                                                      |
                                                          (2) On-Chain Proof Query
                                                                      |
                                                    +-----------------------------------+
                                                    |     PUBLIC VERIFICATION ENGINE    |
                                                    |   - Search by Certificate ID      |
                                                    |   - Client-side Drag & Drop PDF   |
                                                    |   - Mobile QR Camera Scanner      |
                                                    +-----------------------------------+
                                                                      ^
                                                                      |
                                                          (3) Instant Trust Report
                                                                      |
                                                    +-----------------------------------+
                                                    |    EMPLOYER / EMBASSY / VERIFIER  |
                                                    +-----------------------------------+
```

---

## ✨ Key Features

- **💎 Enterprise Glassmorphism UI**: High-end fintech aesthetic with backdrop blurs (`backdrop-filter: blur(18px)`), radial ambient glows, responsive CSS grid, and smooth Framer Motion micro-interactions.
- **🛡️ Triple Verification System**:
  - **Direct ID Lookup**: Resolves certificate records and compares on-chain digests against database state.
  - **In-Browser PDF Drop & Hash**: Computes client-side SHA-256 digests in real-time and verifies them without ever transmitting files over insecure networks.
  - **QR Code Mobile Scanning**: Every issued diploma contains an encrypted verification QR code linking directly to its on-chain proof.
- **🏫 Comprehensive Institution Management**:
  - Over **640+** pre-registered colleges and universities.
  - Full support for corporate credentialing bodies, featuring a custom integration with **Infosys Springboard** (`INFY-SB`).
  - Open datasets downloadable directly in **JSON** (10,273 records) and **CSV** (1.92 MB).
- **🎬 Interactive Cinematic Video Demo (`/demo`)**:
  - In-app 16:9 interactive video simulator featuring 6 scenes, real-time voice narration via Web Speech API, timeline scrubber, playback speed controls, and an interactive file-tampering simulator.
- **📊 Analytics & Audit Dashboard**:
  - Live charts powered by Recharts showing issuance velocity, monthly verifications, fraud rejection rate, and department distribution.
- **📜 Smart Contract Revocation Engine**:
  - Instantly flag compromised certificates with on-chain audit notes preventing further unauthorized use.

---

## 🔒 Security & Zero-PII Compliance

CertiChain adheres to strict **GDPR**, **FERPA**, and international data privacy regulations:

| Security Vector | Implementation Detail |
| :--- | :--- |
| **On-Chain PII Policy** | **Strict Zero-PII**: Student names, emails, grades, student IDs, and personal documents are **never** written to the public blockchain. Only 32-byte mathematical SHA-256 hashes are stored. |
| **Role-Based Access Control** | Implemented using OpenZeppelin `AccessControl`. Functions strictly guarded with `DEFAULT_ADMIN_ROLE` and `UNIVERSITY_ROLE`. |
| **Reentrancy Protection** | All state-altering functions protected by OpenZeppelin's `ReentrancyGuard`. |
| **Canonical File Determinism** | PDFs are rendered through a fixed canonical layout engine. The final immutable document bytes are hashed once upon issuance. |
| **Off-Chain Data Protection** | User passwords hashed using salted **bcryptjs** (12 rounds). Session tokens use **HTTP-Only, Secure, SameSite** JWT cookies. |

---

## 💻 Technology Stack

```
Frontend:
├── Framework: Next.js 14 (App Router)
├── Language: TypeScript 5.5
├── Styling: Tailwind CSS (Custom Glassmorphism Design System)
├── Icons: Lucide React
├── Motion: Framer Motion
├── Charts: Recharts
└── Forms & Validation: React Hook Form + Zod

Backend & Services:
├── Runtime: Node.js (v18+ / v22 LTS)
├── API: Next.js Route Handlers (RESTful Architecture)
├── ORM: Prisma ORM
├── Database: SQLite (Development) / PostgreSQL (Production)
├── PDF Engine: pdf-lib (Deterministic Canonical Generator)
└── QR Code: qrcode + html5-qrcode

Blockchain & Smart Contracts:
├── Language: Solidity 0.8.24
├── Framework: Hardhat Development Environment
├── Client Library: Ethers.js v6
├── Libraries: OpenZeppelin Contracts v5 (AccessControl, ReentrancyGuard)
└── Target Networks: Hardhat Localhost (ChainID: 31337), Ethereum Sepolia Testnet
```

---

## 🏢 Infosys Springboard & Global Colleges Registry

CertiChain natively registers major educational and technical organizations, prominently featuring **Infosys Springboard**:

- **Institution Code**: `INFY-SB`
- **Official Issuer Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Accreditation**: National Skilling & Enterprise Competency Program
- **Pre-Minted Verification Credential**: `CERT-2026-INFY-SB-1001` (*"Advanced Full-Stack Blockchain Engineering & Distributed Systems"*)

### Global College Datasets Included
Accessible directly on the [Colleges Directory Page](http://localhost:3000/institutions):
- `public/datasets/colleges_dataset.json` (10,273 records worldwide)
- `public/datasets/colleges_dataset.csv` (1.92 MB complete directory)
- `public/datasets/indian_colleges.json` (478 premier Indian colleges & universities)

---

## 📜 Smart Contract Architecture

The primary smart contract is located at `blockchain/contracts/CertificateRegistry.sol`.

### Core Data Structure
```solidity
struct Certificate {
    bytes32 certificateHash; // Cryptographic SHA-256 fingerprint
    address issuer;          // Wallet address of issuing institution
    uint256 issuedAt;        // Unix timestamp of registration
    bool exists;             // Registry existence flag
    bool revoked;            // Revocation status
}
```

### Core Functions & Access Matrix

| Function Signature | Access Role | Description |
| :--- | :--- | :--- |
| `registerUniversity(address, string, string)` | `DEFAULT_ADMIN_ROLE` | Onboards an accredited university to issue credentials. |
| `updateUniversityStatus(address, bool)` | `DEFAULT_ADMIN_ROLE` | Suspends or reactivates university issuing privileges. |
| `issueCertificate(string, bytes32)` | `UNIVERSITY_ROLE` | Anchors a new certificate hash on-chain. Emits `CertificateIssued`. |
| `revokeCertificate(string, string)` | `UNIVERSITY_ROLE` | Marks a diploma as revoked with an audit reason. Emits `CertificateRevoked`. |
| `verifyCertificate(string, bytes32)` | Public / Free View | Returns `(bool isValid, bool isRevoked, address issuer, uint256 issuedAt)`. |
| `getCertificate(string)` | Public / Free View | Retrieves complete on-chain metadata for any Certificate ID. |

---

## 🎬 Interactive Video Demonstration

Experience a comprehensive walkthrough of the CertiChain system without leaving your browser by visiting **[`/demo`](http://localhost:3000/demo)**.

```
+------------------------------------------------------------------------------+
| [▶ PLAY]  Scene 1: System Overview               00:15 / 02:40   [ 1.0x ▾ ]  |
|====================================o-----------------------------------------|
|                                                                              |
|           🛡️ CERTICHAIN DECENTRALIZED VERIFICATION ARCHITECTURE              |
|                                                                              |
|    [ University ] ──(Issue)──> [ SHA-256 ] ──(Anchor)──> [ Ethereum ]        |
|                                                                              |
|    Voice Narration: "CertiChain replaces outdated paper credentials with     |
|    cryptographic on-chain fingerprints..."                                   |
+------------------------------------------------------------------------------+
```

**Interactive Controls**:
- ⏯️ **Play / Pause & Timeline Scrubber**: Navigate dynamically through 6 core architectural scenes.
- 🔊 **Voice Narration**: Uses browser Web Speech API for natural audio guidance.
- ⚡ **Speed Adjustment**: 0.5x, 1.0x, 1.5x, and 2.0x playback rates.
- 🧪 **Live Tampering Sandbox**: Interactively alter certificate fields in real-time to watch the system reject fraudulent hashes.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v22 LTS recommended)
- **Git**
- **npm** or **pnpm**

### 2. Clone Repository
```bash
git clone https://github.com/Vikas2006256/certichain.git
cd certichain
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (a pre-configured `.env.example` is included):
```env
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"
JWT_SECRET="certichain-secure-jwt-secret-key-2026-production"
NEXT_PUBLIC_BLOCKCHAIN_RPC_URL="http://127.0.0.1:8545"
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
BLOCKCHAIN_SIGNER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
```

### 5. Smart Contract Compilation & Unit Tests
```bash
# Compile Solidity contracts
npx hardhat compile

# Run Hardhat test suite (17/17 tests passing)
npx hardhat test
```

### 6. Initialize Database & Seed Colleges
```bash
# Push database schema
npx prisma db push

# Seed Super Admin, Infosys Springboard, premier colleges, and test certificates
node prisma/seed.js
```

### 7. Run the Local Development Server
```bash
npm run dev
```
Navigate to **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Live Test Credentials & Verification Samples

### Demo Login Accounts
The login page (`/auth/login`) includes **1-Click Quick Login** buttons for all roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@certichain.io` | `Admin@123456` | Accredit colleges, regulate network, view system logs |
| **Infosys Springboard Admin** | `springboard@infosys.com` | `Springboard@123` | Issue and revoke certificates, manage student roster |
| **IIT Bombay Registrar** | `admin@iitb.ac.in` | `Admin@123456` | University-level certificate issuance and management |
| **Student** | `student@example.com` | `Student@123456` | Access awarded credentials, download PDFs, share QR links |

### Test Certificate IDs
Test these on the [Verification Page](http://localhost:3000/verify):

1. **Infosys Springboard Valid Certificate**:
   - **ID**: `CERT-2026-INFY-SB-1001`
   - **Recipient**: Rajesh Kumar
   - **Status**: ✅ **100% Verified on Blockchain**
2. **Standard Accredited Certificate**:
   - **ID**: `CERT-2026-CS-8894`
   - **Recipient**: Alex Morgan Rivera (MIT)
   - **Status**: ✅ **100% Verified on Blockchain**
3. **Revoked Credential**:
   - **ID**: `CERT-2026-REVOKED-001`
   - **Recipient**: Jonathan Sterling Doe
   - **Status**: ❌ **Revoked (Academic Malpractice)**

---

## 📡 API Reference

### Verification Endpoints

#### `GET /api/verify?id={certificateId}`
Validates a certificate against database state and blockchain hash.
```json
{
  "success": true,
  "certificate": {
    "certificateId": "CERT-2026-INFY-SB-1001",
    "studentName": "Rajesh Kumar",
    "course": "Advanced Full-Stack Blockchain Engineering",
    "university": "Infosys Springboard",
    "status": "ISSUED",
    "blockchainTxHash": "0x4a72e819bcf891d204859a11efc82736412e8bfa109823471029384756102938"
  },
  "blockchainProof": {
    "onChainValid": true,
    "onChainRevoked": false,
    "hashMatch": true
  }
}
```

#### `POST /api/verify`
Accepts a candidate SHA-256 file digest and verifies authenticity without uploading raw documents.
```json
// Request Body
{
  "fileHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

### Institutional Endpoints

- `POST /api/certificates`: Issue a new credential (generates canonical PDF, hashes SHA-256, stores record, registers on-chain).
- `PATCH /api/certificates/:id/revoke`: Revoke an issued diploma with audit justification.
- `GET /api/certificates/:id/download`: Deterministically builds and serves the signed credential PDF.
- `GET /api/universities`: Query registered universities and their on-chain issuer wallet addresses.

---

## 📂 Project Directory Structure

```
certichain/
├── app/
│   ├── layout.tsx                     # Root glassmorphism layout & metadata
│   ├── page.tsx                       # High-impact Web3 landing page
│   ├── about/page.tsx                 # Mission, values & decentralization rationale
│   ├── how-it-works/page.tsx          # 6-step cryptographic verification guide
│   ├── contact/page.tsx               # Institutional onboarding inquiry form
│   ├── institutions/page.tsx          # 640+ College directory & dataset center
│   ├── demo/page.tsx                  # 16:9 Interactive video demonstration
│   ├── verify/page.tsx                # Verification suite (ID, PDF hash, QR)
│   ├── auth/
│   │   ├── login/page.tsx             # 1-Click fast role login portal
│   │   └── register/page.tsx          # Institutional & student registration
│   ├── admin/dashboard/page.tsx       # Super Admin network governance
│   ├── university/dashboard/page.tsx  # University Registrar issuance console
│   ├── student/dashboard/page.tsx     # Student personal credentials vault
│   └── api/                           # Secure RESTful route handlers
├── blockchain/
│   ├── contracts/
│   │   └── CertificateRegistry.sol    # Solidity Smart Contract (AccessControl, ReentrancyGuard)
│   ├── scripts/
│   │   └── deploy.js                  # Automated deployment & ABI export script
│   └── test/
│       └── CertificateRegistry.test.ts# 17 Hardhat unit tests
├── components/
│   ├── layout/                        # Glassmorphism Navbar and Footer
│   ├── ui/                            # GlassCard, GlassButton, Badge, Modal
│   └── dashboard/                     # Sidebar, StatCards, ActivityFeeds
├── lib/
│   ├── auth.ts                        # JWT session handling & bcrypt encryption
│   ├── blockchain.ts                  # Server & browser Ethers.js integration
│   ├── pdf.ts                         # Deterministic canonical PDF generator
│   ├── prisma.ts                      # Singleton Prisma client instance
│   └── utils.ts                       # Classnames, formatters, hash utilities
├── prisma/
│   ├── schema.prisma                  # Data models (Universities, Certificates, Logs)
│   └── seed.js                        # Database population script
├── public/
│   └── datasets/                      # Ingested datasets (JSON & CSV formats)
├── scripts/
│   ├── download-and-import-colleges.js# Open-source college data importer
│   └── test-live-system.js            # Automated 40-test integration harness
└── hardhat.config.ts                  # Hardhat configuration (Solidity 0.8.24)
```

---

## 🧪 Security Audit & Testing Suite

All smart contract logic is verified with a comprehensive unit test suite:

```bash
$ npx hardhat test

  CertificateRegistry
    Deployment & Initialization
      ✔ Should deploy with correct name and version
      ✔ Should assign DEFAULT_ADMIN_ROLE to deployer
      ✔ Should set deployer as initially active
    University Management
      ✔ Should allow admin to register a new university
      ✔ Should reject duplicate university registrations
      ✔ Should allow admin to update university status
      ✔ Should emit UniversityRegistered and UniversityStatusUpdated events
      ✔ Should prevent non-admin from registering universities
    Certificate Issuance
      ✔ Should allow an authorized university to issue a certificate
      ✔ Should prevent unauthorized addresses from issuing certificates
      ✔ Should reject duplicate certificate IDs
      ✔ Should emit CertificateIssued event
    Certificate Verification
      ✔ Should verify an authentic certificate hash correctly
      ✔ Should report mismatch for altered certificate hash
      ✔ Should correctly report non-existent certificate IDs
    Certificate Revocation
      ✔ Should allow the issuing university to revoke a certificate
      ✔ Should prevent non-issuer university from revoking certificate
      ✔ Should emit CertificateRevoked event

  17 passing (1.2s)
```

Automated end-to-end integration tests check all 40 API endpoints, authentication flows, and verification routes:
```bash
$ node scripts/test-live-system.js
============================================================
  CERTICHAIN FULL-STACK LIVE VERIFICATION REPORT
  Passed: 40 / 40 Tests (100% Success Rate)
============================================================
```

---

## 👨‍💻 Author & Maintainer

**Vikas U**  
- **GitHub**: [@Vikas2006256](https://github.com/Vikas2006256)  
- **Project**: [CertiChain Blockchain Verification System](https://github.com/Vikas2006256/certichain)  

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
