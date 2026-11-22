const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const QRCode = require("qrcode");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Registering all accredited colleges & universities on CertiChain...");

  // Clean existing records in correct foreign key order
  await prisma.verificationLog.deleteMany({});
  await prisma.blockchainTransaction.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.university.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", salt);
  const uniPasswordHash = await bcrypt.hash("UniversityPassword123!", salt);
  const studentPasswordHash = await bcrypt.hash("StudentPassword123!", salt);

  // 1. Create Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@certichain.io",
      passwordHash: adminPasswordHash,
      name: "Global Governance Admin",
      role: "SUPER_ADMIN",
      walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
  });
  console.log("✔ Created Super Admin:", adminUser.email);

  // 2. Comprehensive Roster of Accredited Global Colleges & Universities
  const collegesData = [
    {
      name: "Massachusetts Institute of Technology",
      code: "MIT",
      contactEmail: "registrar@mit.edu",
      address: "77 Massachusetts Ave, Cambridge, MA 02139, USA",
      website: "https://web.mit.edu",
      walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      status: "APPROVED",
      description: "World leader in science, engineering, and technology education and cutting-edge research.",
    },
    {
      name: "Stanford University",
      code: "STAN",
      contactEmail: "registrar@stanford.edu",
      address: "450 Jane Stanford Way, Stanford, CA 94305, USA",
      website: "https://www.stanford.edu",
      walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      status: "APPROVED",
      description: "Pioneering research university in Silicon Valley driving global innovation and leadership.",
    },
    {
      name: "Harvard University",
      code: "HARV",
      contactEmail: "registrar@harvard.edu",
      address: "Massachusetts Hall, Cambridge, MA 02138, USA",
      website: "https://www.harvard.edu",
      walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      status: "APPROVED",
      description: "Oldest institution of higher learning in the United States, established in 1636.",
    },
    {
      name: "University of California, Berkeley",
      code: "UCB",
      contactEmail: "registrar@berkeley.edu",
      address: "110 Sproul Hall, Berkeley, CA 94720, USA",
      website: "https://www.berkeley.edu",
      walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      status: "APPROVED",
      description: "Premier public research university renowned for scientific discoveries and social change.",
    },
    {
      name: "University of Oxford",
      code: "OXF",
      contactEmail: "degrees@ox.ac.uk",
      address: "University Offices, Wellington Square, Oxford OX1 2JD, UK",
      website: "https://www.ox.ac.uk",
      walletAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      status: "APPROVED",
      description: "The oldest university in the English-speaking world, world-leading in collegiate education.",
    },
    {
      name: "University of Cambridge",
      code: "CAM",
      contactEmail: "records@cam.ac.uk",
      address: "The Old Schools, Trinity Ln, Cambridge CB2 1TN, UK",
      website: "https://www.cam.ac.uk",
      walletAddress: "0x976EA74026E72CD55543b04ABd4263ad80424E52",
      status: "APPROVED",
      description: "Globally acclaimed collegiate university renowned for mathematics and natural sciences.",
    },
    {
      name: "California Institute of Technology",
      code: "CALTECH",
      contactEmail: "registrar@caltech.edu",
      address: "1200 E California Blvd, Pasadena, CA 91125, USA",
      website: "https://www.caltech.edu",
      walletAddress: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      status: "APPROVED",
      description: "World-renowned science and engineering institute managing NASA's Jet Propulsion Laboratory.",
    },
    {
      name: "Princeton University",
      code: "PRINCE",
      contactEmail: "registrar@princeton.edu",
      address: "Princeton, NJ 08544, USA",
      website: "https://www.princeton.edu",
      walletAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      status: "APPROVED",
      description: "Distinguished Ivy League institution emphasizing undergraduate teaching and profound research.",
    },
    {
      name: "Columbia University",
      code: "COLUM",
      contactEmail: "registrar@columbia.edu",
      address: "116th St & Broadway, New York, NY 10027, USA",
      website: "https://www.columbia.edu",
      walletAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      status: "APPROVED",
      description: "Historic Manhattan Ivy League institution at the nexus of international global affairs.",
    },
    {
      name: "Imperial College London",
      code: "ICL",
      contactEmail: "registry@imperial.ac.uk",
      address: "Exhibition Rd, South Kensington, London SW7 2BX, UK",
      website: "https://www.imperial.ac.uk",
      walletAddress: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
      status: "APPROVED",
      description: "Science-based institution with world-tier reputation in engineering, medicine, and business.",
    },
    {
      name: "ETH Zurich",
      code: "ETHZ",
      contactEmail: "registrar@ethz.ch",
      address: "Ramistrasse 101, 8092 Zurich, Switzerland",
      website: "https://ethz.ch",
      walletAddress: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
      status: "APPROVED",
      description: "Premier continental European science and technology university, birthplace of Einstein's education.",
    },
    {
      name: "National University of Singapore",
      code: "NUS",
      contactEmail: "registrar@nus.edu.sg",
      address: "21 Lower Kent Ridge Rd, Singapore 119077",
      website: "https://www.nus.edu.sg",
      walletAddress: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
      status: "APPROVED",
      description: "Asia's top-ranked comprehensive research university driving quantum and computational leadership.",
    },
    {
      name: "Indian Institute of Technology Bombay",
      code: "IITB",
      contactEmail: "academic@iitb.ac.in",
      address: "Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076, India",
      website: "https://www.iitb.ac.in",
      walletAddress: "0x1CBD3E2b803cA0414560F783298835Cc6327076B",
      status: "APPROVED",
      description: "Globally recognized institute of national importance producing premier engineering and tech leaders.",
    },
    {
      name: "University of Toronto",
      code: "UOFT",
      contactEmail: "transcripts@utoronto.ca",
      address: "27 King's College Cir, Toronto, ON M5S, Canada",
      website: "https://www.utoronto.ca",
      walletAddress: "0x4298865E5e1923429438661396243b0A8940386C",
      status: "APPROVED",
      description: "Canada's top research university, pioneering breakthroughs from insulin to deep learning.",
    },
    {
      name: "University of Melbourne",
      code: "UNIMELB",
      contactEmail: "enquiries@unimelb.edu.au",
      address: "Parkville VIC 3010, Australia",
      website: "https://www.unimelb.edu.au",
      walletAddress: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      status: "APPROVED",
      description: "Australia's leading research institution consistently ranked number one in Oceania.",
    },
    {
      name: "Infosys Springboard",
      code: "INFY-SB",
      contactEmail: "springboard@infosys.com",
      address: "Infosys Limited, Electronics City, Hosur Road, Bangalore, Karnataka 560100, India",
      website: "https://infyspringboard.onwingspan.com",
      walletAddress: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
      status: "APPROVED",
      description: "Infosys flagship digital learning and professional skill development platform delivering certifications in Cloud, AI, Full-Stack, and Software Architecture.",
    },
  ];

  const createdUniversities = [];
  for (const uni of collegesData) {
    const created = await prisma.university.create({
      data: uni,
    });
    createdUniversities.push(created);

    // Create registrar user for each college
    await prisma.user.create({
      data: {
        email: uni.contactEmail,
        passwordHash: uniPasswordHash,
        name: `Registrar Office (${uni.code})`,
        role: "UNIVERSITY_ADMIN",
        walletAddress: uni.walletAddress,
        universityId: created.id,
      },
    });
  }

  console.log(`✔ Successfully registered ${createdUniversities.length} accredited global colleges and universities!`);

  // Map for easy access
  const mit = createdUniversities.find((u) => u.code === "MIT");
  const stanford = createdUniversities.find((u) => u.code === "STAN");
  const harvard = createdUniversities.find((u) => u.code === "HARV");
  const oxf = createdUniversities.find((u) => u.code === "OXF");
  const iitb = createdUniversities.find((u) => u.code === "IITB");
  const ethz = createdUniversities.find((u) => u.code === "ETHZ");
  const infy = createdUniversities.find((u) => u.code === "INFY-SB");

  // 3. Create Sample Students
  const studentUser1 = await prisma.user.create({
    data: {
      email: "alex.rivera@alumni.mit.edu",
      passwordHash: studentPasswordHash,
      name: "Alex Morgan Rivera",
      role: "STUDENT",
      walletAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      universityId: mit.id,
    },
  });

  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      studentIdNumber: "MIT-2024-001",
      universityId: mit.id,
      department: "Electrical Engineering and Computer Science",
      program: "Bachelor of Science",
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: "sophia.chen@alumni.stanford.edu",
      passwordHash: studentPasswordHash,
      name: "Sophia Chen",
      role: "STUDENT",
      walletAddress: "0xdd224571A1437b6f82a6B14D7e462e175b302B82",
      universityId: stanford.id,
    },
  });

  const student2 = await prisma.student.create({
    data: {
      userId: studentUser2.id,
      studentIdNumber: "STAN-2024-042",
      universityId: stanford.id,
      department: "School of Engineering",
      program: "Master of Science in Artificial Intelligence",
    },
  });

  const studentUser3 = await prisma.user.create({
    data: {
      email: "rahul.sharma@alumni.iitb.ac.in",
      passwordHash: studentPasswordHash,
      name: "Rahul Sharma",
      role: "STUDENT",
      walletAddress: "0x0A97843B20919245582963B250523d4CcfB3411e",
      universityId: iitb.id,
    },
  });

  const student3 = await prisma.student.create({
    data: {
      userId: studentUser3.id,
      studentIdNumber: "IITB-2024-108",
      universityId: iitb.id,
      department: "Computer Science and Engineering",
      program: "Bachelor of Technology",
    },
  });

  const studentUser4 = await prisma.user.create({
    data: {
      email: "ananya.verma@talent.infosys.com",
      passwordHash: studentPasswordHash,
      name: "Ananya Verma",
      role: "STUDENT",
      walletAddress: "0x324469d9E0779771B46664682E637360440C734e",
      universityId: infy.id,
    },
  });

  const student4 = await prisma.student.create({
    data: {
      userId: studentUser4.id,
      studentIdNumber: "SB-2024-INFY-9941",
      universityId: infy.id,
      department: "Cloud & Digital Technologies Academy",
      program: "Infosys Springboard Certification Track",
    },
  });

  // 4. Generate Deterministic Certificates for Registered Colleges
  const qrCert1 = await QRCode.toDataURL("http://localhost:3000/verify?id=CERT-2026-CS-8894");
  const qrCert2 = await QRCode.toDataURL("http://localhost:3000/verify?id=CERT-2026-AI-5510");
  const qrCert3 = await QRCode.toDataURL("http://localhost:3000/verify?id=CERT-2026-IITB-9201");
  const qrCert4 = await QRCode.toDataURL("http://localhost:3000/verify?id=CERT-2026-REVOKED-001");
  const qrCert5 = await QRCode.toDataURL("http://localhost:3000/verify?id=CERT-2026-INFY-SB-1001");

  const hash1 = "0x" + crypto.createHash("sha256").update("CERTIFICATE:CERT-2026-CS-8894:Alex Morgan Rivera:MIT").digest("hex");
  const hash2 = "0x" + crypto.createHash("sha256").update("CERTIFICATE:CERT-2026-AI-5510:Sophia Chen:STAN").digest("hex");
  const hash3 = "0x" + crypto.createHash("sha256").update("CERTIFICATE:CERT-2026-IITB-9201:Rahul Sharma:IITB").digest("hex");
  const hash4 = "0x" + crypto.createHash("sha256").update("CERTIFICATE:CERT-2026-REVOKED-001:John Malicious Doe:HARV").digest("hex");
  const hash5 = "0x" + crypto.createHash("sha256").update("CERTIFICATE:CERT-2026-INFY-SB-1001:Ananya Verma:INFY-SB").digest("hex");

  // Certificate 1: MIT
  const cert1 = await prisma.certificate.create({
    data: {
      id: "CERT-2026-CS-8894",
      certHash: hash1,
      title: "Bachelor of Science in Computer Science",
      recipientName: "Alex Morgan Rivera",
      studentIdNumber: "MIT-2024-001",
      studentEmail: "alex.rivera@alumni.mit.edu",
      universityId: mit.id,
      studentRefId: student1.id,
      issueDate: new Date("2024-06-15T10:00:00Z"),
      grade: "Summa Cum Laude (GPA: 3.96)",
      description: "Conferred with highest academic distinction for research in decentralized consensus protocols.",
      department: "Electrical Engineering & Computer Science",
      documentFilename: "alex_rivera_mit_degree.pdf",
      txHash: "0x4e07b94998797f8647e300295757099999485a0ef8e0030be9ef7439246160e2",
      blockNumber: 4829103,
      status: "ISSUED",
      isPublicViewable: true,
      qrCodeDataUrl: qrCert1,
    },
  });

  // Certificate 2: Stanford
  const cert2 = await prisma.certificate.create({
    data: {
      id: "CERT-2026-AI-5510",
      certHash: hash2,
      title: "Master of Science in Artificial Intelligence",
      recipientName: "Sophia Chen",
      studentIdNumber: "STAN-2024-042",
      studentEmail: "sophia.chen@alumni.stanford.edu",
      universityId: stanford.id,
      studentRefId: student2.id,
      issueDate: new Date("2024-08-20T10:00:00Z"),
      grade: "Distinction (GPA: 4.0)",
      description: "Honored for pioneering work on cryptographic verification mechanisms in LLM architectures.",
      department: "School of Engineering",
      documentFilename: "sophia_chen_stanford_degree.pdf",
      txHash: "0x78ab126027a00a12cf20104193560126782194a0ef8e0030be9ef74392461601",
      blockNumber: 4831204,
      status: "ISSUED",
      isPublicViewable: true,
      qrCodeDataUrl: qrCert2,
    },
  });

  // Certificate 3: IIT Bombay
  const cert3 = await prisma.certificate.create({
    data: {
      id: "CERT-2026-IITB-9201",
      certHash: hash3,
      title: "Bachelor of Technology in Computer Science",
      recipientName: "Rahul Sharma",
      studentIdNumber: "IITB-2024-108",
      studentEmail: "rahul.sharma@alumni.iitb.ac.in",
      universityId: iitb.id,
      studentRefId: student3.id,
      issueDate: new Date("2024-07-28T10:00:00Z"),
      grade: "Institute Silver Medal (CPI: 9.85)",
      description: "Conferred for exceptional academic merit and research contributions in secure distributed systems.",
      department: "Computer Science and Engineering",
      documentFilename: "rahul_sharma_iitb_degree.pdf",
      txHash: "0x89dc24510bcf2391054a12398457018945a0ef8e0030be9ef743924616099",
      blockNumber: 4833400,
      status: "ISSUED",
      isPublicViewable: true,
      qrCodeDataUrl: qrCert3,
    },
  });

  // Certificate 4: Revoked Certificate (Harvard)
  const cert4 = await prisma.certificate.create({
    data: {
      id: "CERT-2026-REVOKED-001",
      certHash: hash4,
      title: "Bachelor of Arts in Economics",
      recipientName: "Jonathan Sterling Doe",
      studentIdNumber: "HARV-2022-998",
      studentEmail: "j.doe@example.com",
      universityId: harvard.id,
      issueDate: new Date("2023-05-12T10:00:00Z"),
      grade: "Recalled",
      description: "Recalled following an investigation by the University Academic Integrity Disciplinary Committee.",
      department: "Faculty of Arts and Sciences",
      txHash: "0x112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00",
      blockNumber: 4810012,
      status: "REVOKED",
      revocationReason: "Falsification of academic admission credentials and examination misconduct",
      revokedAt: new Date("2024-01-10T14:30:00Z"),
      isPublicViewable: true,
      qrCodeDataUrl: qrCert4,
    },
  });

  // Certificate 5: Infosys Springboard
  const cert5 = await prisma.certificate.create({
    data: {
      id: "CERT-2026-INFY-SB-1001",
      certHash: hash5,
      title: "Infosys Certified Java Full-Stack & Cloud Microservices Specialist",
      recipientName: "Ananya Verma",
      studentIdNumber: "SB-2024-INFY-9941",
      studentEmail: "ananya.verma@talent.infosys.com",
      universityId: infy.id,
      studentRefId: student4.id,
      issueDate: new Date("2024-09-10T10:00:00Z"),
      grade: "Distinction with Honors (Score: 96%)",
      description: "Successfully mastered enterprise Java, Spring Boot, Microservices, Docker, Kubernetes, and AWS Cloud Architecture on Infosys Springboard.",
      department: "Infosys Springboard Digital Academy",
      documentFilename: "ananya_verma_infosys_springboard.pdf",
      txHash: "0x56be234019ab2398571092847501982736450192847501928374650192837465",
      blockNumber: 4835120,
      status: "ISSUED",
      isPublicViewable: true,
      qrCodeDataUrl: qrCert5,
    },
  });

  // 5. Verification Logs
  await prisma.verificationLog.create({
    data: {
      certificateId: cert1.id,
      verifiedByIp: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0",
      method: "SEARCH",
      isValid: true,
      resultStatus: "VERIFIED",
      verificationHash: hash1,
    },
  });

  await prisma.verificationLog.create({
    data: {
      certificateId: cert2.id,
      verifiedByIp: "192.168.1.102",
      userAgent: "Mobile Safari (iPhone 15 Pro)",
      method: "QR_SCAN",
      isValid: true,
      resultStatus: "VERIFIED",
      verificationHash: hash2,
    },
  });

  await prisma.verificationLog.create({
    data: {
      certificateId: cert3.id,
      verifiedByIp: "192.168.1.103",
      userAgent: "Employer Background Check Service",
      method: "SEARCH",
      isValid: true,
      resultStatus: "VERIFIED",
      verificationHash: hash3,
    },
  });

  await prisma.verificationLog.create({
    data: {
      certificateId: cert4.id,
      verifiedByIp: "192.168.1.200",
      userAgent: "Headless Verification Bot v1.2",
      method: "SEARCH",
      isValid: false,
      resultStatus: "REVOKED",
      verificationHash: hash4,
    },
  });

  await prisma.verificationLog.create({
    data: {
      certificateId: cert5.id,
      verifiedByIp: "192.168.1.105",
      userAgent: "Infosys Recruiter Portal Verification Client",
      method: "QR_SCAN",
      isValid: true,
      resultStatus: "VERIFIED",
      verificationHash: hash5,
    },
  });

  // 6. Blockchain Transaction Logs
  await prisma.blockchainTransaction.create({
    data: {
      txHash: cert1.txHash,
      blockNumber: cert1.blockNumber,
      fromAddress: mit.walletAddress,
      toAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName: "issueCertificate",
      status: "CONFIRMED",
      gasUsed: "124,532",
      certificateId: cert1.id,
      details: `Certificate ${cert1.id} anchored on-chain for ${cert1.recipientName}`,
    },
  });

  await prisma.blockchainTransaction.create({
    data: {
      txHash: cert2.txHash,
      blockNumber: cert2.blockNumber,
      fromAddress: stanford.walletAddress,
      toAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName: "issueCertificate",
      status: "CONFIRMED",
      gasUsed: "124,532",
      certificateId: cert2.id,
      details: `Certificate ${cert2.id} anchored on-chain for ${cert2.recipientName}`,
    },
  });

  await prisma.blockchainTransaction.create({
    data: {
      txHash: cert3.txHash,
      blockNumber: cert3.blockNumber,
      fromAddress: iitb.walletAddress,
      toAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName: "issueCertificate",
      status: "CONFIRMED",
      gasUsed: "126,890",
      certificateId: cert3.id,
      details: `Certificate ${cert3.id} anchored on-chain for ${cert3.recipientName}`,
    },
  });

  await prisma.blockchainTransaction.create({
    data: {
      txHash: cert5.txHash,
      blockNumber: cert5.blockNumber,
      fromAddress: infy.walletAddress,
      toAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      functionName: "issueCertificate",
      status: "CONFIRMED",
      gasUsed: "128,450",
      certificateId: cert5.id,
      details: `Certificate ${cert5.id} anchored on-chain for ${cert5.recipientName}`,
    },
  });

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "ALL_INSTITUTIONS_REGISTERED",
      resource: "UniversityRegistry",
      details: `16 accredited global institutions & universities registered, including Infosys Springboard`,
      ipAddress: "127.0.0.1",
    },
  });

  console.log("=================================================");
  console.log("✔ ALL ACCREDITED INSTITUTIONS & INFOSYS SPRINGBOARD REGISTERED!");
  console.log("Includes: Infosys Springboard (INFY-SB), MIT, Stanford, Harvard,");
  console.log("UC Berkeley, Oxford, Cambridge, Caltech, Princeton, Columbia,");
  console.log("Imperial College, ETH Zurich, NUS, IIT Bombay, U of Toronto, Melbourne.");
  console.log("Test Infosys Springboard Cert ID: CERT-2026-INFY-SB-1001");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
