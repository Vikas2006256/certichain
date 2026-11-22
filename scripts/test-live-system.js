const http = require("http");

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const bodyBuffer = Buffer.concat(chunks);
        const bodyText = bodyBuffer.toString("utf8");
        let json = null;
        try {
          json = JSON.parse(bodyText);
        } catch {
          // not json
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          bodyText,
          bodyBuffer,
          json,
        });
      });
    });

    req.on("error", reject);

    if (postData) {
      if (typeof postData === "object") {
        req.write(JSON.stringify(postData));
      } else {
        req.write(postData);
      }
    }
    req.end();
  });
}

async function runLiveTests() {
  console.log("=================================================");
  console.log("🚀 CERTICHAIN LIVE APPLICATION VERIFICATION SUITE");
  console.log("Testing against: http://localhost:3000");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✔ [PASS] ${message}`);
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // TEST 1: Landing Page
  console.log("[Test 1/10] Verifying Landing Page (GET /)...");
  const homeRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/",
    method: "GET",
  });
  assert(homeRes.statusCode === 200, "Landing page returned HTTP 200 OK");
  assert(homeRes.bodyText.includes("CertiChain") || homeRes.bodyText.includes("Certi"), "Landing page renders CertiChain branding");
  assert(homeRes.bodyText.includes("Trust Every Certificate"), "Landing page contains hero headline");

  // TEST 2: Institutions Directory
  console.log("\n[Test 2/10] Verifying Colleges Directory (GET /institutions)...");
  const instRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/institutions",
    method: "GET",
  });
  assert(instRes.statusCode === 200, "Institutions page returned HTTP 200 OK");
  assert(instRes.bodyText.includes("Colleges") || instRes.bodyText.includes("Institutions"), "Directory title rendered");

  // TEST 3: Universities API
  console.log("\n[Test 3/10] Querying Universities API (GET /api/universities)...");
  const uniRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/universities",
    method: "GET",
  });
  assert(uniRes.statusCode === 200, "API returned HTTP 200 OK");
  assert(Array.isArray(uniRes.json?.universities), "Returned universities array");
  const universities = uniRes.json.universities;
  assert(universities.length >= 16, `Found ${universities.length} registered colleges (expected >= 16)`);
  
  const infyUni = universities.find((u) => u.code === "INFY-SB");
  assert(!!infyUni, "Infosys Springboard (INFY-SB) is present in registered colleges");
  assert(infyUni.status === "APPROVED", "Infosys Springboard status is APPROVED");
  console.log(`     -> Verified Infosys Springboard on-chain issuer: ${infyUni.walletAddress}`);

  // TEST 4: Public Verification of Infosys Springboard Certificate
  console.log("\n[Test 4/10] Verifying Infosys Springboard Certificate (POST /api/verify)...");
  const infyVerifyRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { certId: "CERT-2026-INFY-SB-1001", method: "SEARCH" }
  );
  assert(infyVerifyRes.statusCode === 200, "Verify endpoint returned HTTP 200 OK");
  assert(infyVerifyRes.json?.verified === true, "Certificate status is verified: true");
  assert(infyVerifyRes.json?.status === "VERIFIED", "Status code is VERIFIED");
  assert(infyVerifyRes.json?.certificate?.universityName === "Infosys Springboard", "Issued by Infosys Springboard");
  assert(infyVerifyRes.json?.certificate?.recipientName === "Ananya Verma", "Recipient is Ananya Verma");
  assert(infyVerifyRes.json?.certificate?.title.includes("Java Full-Stack"), "Title is Java Full-Stack & Cloud Microservices");
  console.log(`     -> SHA-256 Fingerprint: ${infyVerifyRes.json.certificate.certHash}`);
  console.log(`     -> Blockchain Tx: ${infyVerifyRes.json.certificate.txHash}`);

  // TEST 5: Public Verification of MIT Certificate
  console.log("\n[Test 5/10] Verifying MIT Degree (POST /api/verify)...");
  const mitVerifyRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { certId: "CERT-2026-CS-8894", method: "SEARCH" }
  );
  assert(mitVerifyRes.statusCode === 200, "Verify endpoint returned HTTP 200 OK");
  assert(mitVerifyRes.json?.verified === true, "MIT Certificate verified: true");
  assert(mitVerifyRes.json?.certificate?.recipientName === "Alex Morgan Rivera", "Recipient is Alex Morgan Rivera");

  // TEST 6: Revoked Certificate Detection
  console.log("\n[Test 6/10] Testing Revoked Certificate Detection (CERT-2026-REVOKED-001)...");
  const revokedVerifyRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { certId: "CERT-2026-REVOKED-001", method: "SEARCH" }
  );
  assert(revokedVerifyRes.statusCode === 200, "Verify endpoint returned HTTP 200 OK");
  assert(revokedVerifyRes.json?.verified === false, "Revoked certificate verified: false");
  assert(revokedVerifyRes.json?.status === "REVOKED", "Status strictly reported as REVOKED");
  assert(!!revokedVerifyRes.json?.certificate?.revocationReason, "Audit revocation reason is present");
  console.log(`     -> Documented Reason: "${revokedVerifyRes.json.certificate.revocationReason}"`);

  // TEST 7: Non-existent Certificate Handling
  console.log("\n[Test 7/10] Testing Non-Existent Certificate Handling (CERT-NONEXISTENT-9999)...");
  const notFoundRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { certId: "CERT-NONEXISTENT-9999", method: "SEARCH" }
  );
  assert(notFoundRes.statusCode === 404, "Non-existent certificate returns HTTP 404");
  assert(notFoundRes.json?.status === "NOT_FOUND", "Status is NOT_FOUND");

  // TEST 8: PDF Download
  console.log("\n[Test 8/10] Downloading Canonical Certificate PDF...");
  const pdfRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/certificates/CERT-2026-INFY-SB-1001/download",
    method: "GET",
  });
  assert(pdfRes.statusCode === 200, "PDF download returned HTTP 200 OK");
  assert(pdfRes.headers["content-type"] === "application/pdf", "Content-Type is application/pdf");
  const isPdf = pdfRes.bodyBuffer.slice(0, 5).toString("utf8") === "%PDF-";
  assert(isPdf, "Generated binary buffer is a valid PDF document (starts with %PDF-)");
  console.log(`     -> PDF Size: ${(pdfRes.bodyBuffer.length / 1024).toFixed(1)} KB`);

  // TEST 9: Super Admin Authentication
  console.log("\n[Test 9/10] Testing Authentication System (POST /api/auth/login)...");
  const loginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "admin@certichain.io", password: "AdminPassword123!" }
  );
  assert(loginRes.statusCode === 200, "Login returned HTTP 200 OK");
  assert(loginRes.json?.user?.role === "SUPER_ADMIN", "Super Admin role granted");
  assert(!!loginRes.json?.token, "JWT token generated");
  const authCookie = loginRes.headers["set-cookie"]?.[0] || "";
  assert(authCookie.includes("certichain_session"), "HTTP-only session cookie set");

  // TEST 10: Infosys Springboard Registrar Login & Certificate Issuance
  console.log("\n[Test 10/10] Logging in as Infosys Springboard Registrar & Issuing New Credential...");
  const infyLoginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { email: "springboard@infosys.com", password: "UniversityPassword123!" }
  );
  assert(infyLoginRes.statusCode === 200, "Infosys Springboard login returned HTTP 200 OK");
  assert(infyLoginRes.json?.user?.role === "UNIVERSITY_ADMIN", "University Admin role verified");
  const infySessionCookie = infyLoginRes.headers["set-cookie"]?.[0]?.split(";")[0] || "";

  // Now issue a new credential via authenticated session
  const issueRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/certificates",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: infySessionCookie,
      },
    },
    {
      recipientName: "Vikram Malhotra",
      studentIdNumber: "SB-2024-INFY-10492",
      studentEmail: "vikram.malhotra@alumni.infosys.com",
      title: "Infosys Certified Artificial Intelligence Solutions Architect",
      department: "Infosys Springboard AI Institute",
      grade: "Distinction with Honors",
      description: "Demonstrated advanced mastery of Generative AI, Large Language Models, and Scalable Neural Architectures.",
    }
  );

  assert(issueRes.statusCode === 200, "Issuance endpoint returned HTTP 200 OK");
  assert(issueRes.json?.success === true, "Issuance reported success: true");
  const newCert = issueRes.json?.certificate;
  assert(!!newCert?.id, `Generated new certificate ID: ${newCert?.id}`);
  assert(newCert?.recipientName === "Vikram Malhotra", "Issued to Vikram Malhotra");
  assert(!!newCert?.certHash, `Computed on-chain SHA-256: ${newCert?.certHash}`);
  console.log(`     -> Newly issued certificate ID: ${newCert.id}`);

  // Instantly verify the newly issued credential
  const verifyNewRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/verify",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { certId: newCert.id, method: "SEARCH" }
  );
  assert(verifyNewRes.json?.verified === true, "Newly minted certificate is immediately verified on-chain!");

  console.log("\n=================================================");
  console.log(`🎉 ALL ${passed}/${total} LIVE SYSTEM TESTS PASSED SUCCESSFULLY!`);
  console.log("=================================================");
}

runLiveTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
