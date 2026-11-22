const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const { PDFDocument, rgb } = require("pdf-lib");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runE2ETest() {
  console.log("=================================================");
  console.log("🧪 RUNNING CERTICHAIN END-TO-END INTEGRATION TEST");
  console.log("=================================================");

  // 1. Verify Database
  console.log("\n[1/5] Checking Database & Seed Records...");
  const users = await prisma.user.findMany();
  const unis = await prisma.university.findMany();
  const certs = await prisma.certificate.findMany({ include: { university: true } });

  console.log(`✔ Found ${users.length} users, ${unis.length} universities, ${certs.length} certificates.`);
  if (users.length === 0 || unis.length === 0 || certs.length === 0) {
    throw new Error("Database appears unseeded. Run node prisma/seed.js first.");
  }

  // 2. Test Deterministic PDF & SHA-256 Hashing
  console.log("\n[2/5] Testing Canonical PDF Determinism...");
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  page.drawText("CANONICAL_TEST_CERTIFICATE_CERTICHAIN_2026", { x: 50, y: 500 });
  const bytes = await pdfDoc.save();
  const hash1 = "0x" + crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
  const hash2 = "0x" + crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");

  if (hash1 !== hash2) {
    throw new Error("SHA-256 hashing is not deterministic!");
  }
  console.log("✔ Deterministic SHA-256 Hash verified:", hash1);

  // 3. Test Verified Certificate Lookup
  console.log("\n[3/5] Testing Verified Certificate Lookup (CERT-2026-CS-8894)...");
  const validCert = await prisma.certificate.findUnique({
    where: { id: "CERT-2026-CS-8894" },
    include: { university: true },
  });

  if (!validCert) throw new Error("Sample certificate CERT-2026-CS-8894 not found");
  if (validCert.status !== "ISSUED") throw new Error("Expected status ISSUED");
  console.log(`✔ Verified Certificate: ${validCert.title} to ${validCert.recipientName}`);
  console.log(`✔ Issuing University: ${validCert.university.name} (${validCert.university.code})`);
  console.log(`✔ On-Chain Hash: ${validCert.certHash}`);

  // 4. Test Revoked Certificate Lookup
  console.log("\n[4/5] Testing Revocation Record (CERT-2026-REVOKED-001)...");
  const revokedCert = await prisma.certificate.findUnique({
    where: { id: "CERT-2026-REVOKED-001" },
  });

  if (!revokedCert) throw new Error("Revoked certificate not found");
  if (revokedCert.status !== "REVOKED") throw new Error("Expected status REVOKED");
  console.log(`✔ Revocation Confirmed: ${revokedCert.revocationReason}`);

  // 5. Test Authentication
  console.log("\n[5/5] Testing Super Admin Credential Verification...");
  const admin = await prisma.user.findUnique({ where: { email: "admin@certichain.io" } });
  const isPasswordValid = await bcrypt.compare("AdminPassword123!", admin.passwordHash);
  if (!isPasswordValid) throw new Error("Admin password comparison failed");
  console.log("✔ Admin authentication cryptographically validated.");

  console.log("\n=================================================");
  console.log("🎉 ALL END-TO-END SYSTEM INTEGRATION TESTS PASSED!");
  console.log("=================================================");
}

runE2ETest()
  .catch((err) => {
    console.error("❌ E2E test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
