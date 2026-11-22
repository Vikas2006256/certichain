import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { CertificateRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CertificateRegistry Smart Contract", function () {
  let registry: CertificateRegistry;
  let admin: HardhatEthersSigner;
  let university1: HardhatEthersSigner;
  let university2: HardhatEthersSigner;
  let outsider: HardhatEthersSigner;

  // Helpers
  const stringToBytes32 = (str: string) => ethers.keccak256(ethers.toUtf8Bytes(str));
  const sampleCertId = stringToBytes32("CERT-2026-CS-0001");
  const sampleDocHash = ethers.sha256(ethers.toUtf8Bytes("CANONICAL_PDF_CONTENT_MOCK_2026"));

  beforeEach(async function () {
    [admin, university1, university2, outsider] = await ethers.getSigners();

    const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry");
    registry = await CertificateRegistryFactory.deploy(admin.address);
    await registry.waitForDeployment();
  });

  describe("Deployment & Access Control", function () {
    it("Should set the deployer as DEFAULT_ADMIN_ROLE", async function () {
      const DEFAULT_ADMIN_ROLE = await registry.DEFAULT_ADMIN_ROLE();
      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.be.true;
      expect(await registry.hasRole(DEFAULT_ADMIN_ROLE, university1.address)).to.be.false;
    });

    it("Should start with zero certificates and zero universities", async function () {
      expect(await registry.totalCertificatesIssued()).to.equal(0);
      expect(await registry.totalCertificatesRevoked()).to.equal(0);
      expect(await registry.totalUniversitiesRegistered()).to.equal(0);
    });
  });

  describe("University Management", function () {
    it("Admin can register a university and grant UNIVERSITY_ROLE", async function () {
      const UNIVERSITY_ROLE = await registry.UNIVERSITY_ROLE();
      await expect(
        registry.connect(admin).registerUniversity(
          university1.address,
          "Massachusetts Institute of Technology",
          "MIT"
        )
      )
        .to.emit(registry, "UniversityRegistered")
        .withArgs(university1.address, "Massachusetts Institute of Technology", "MIT", (v: any) => !!v);

      expect(await registry.hasRole(UNIVERSITY_ROLE, university1.address)).to.be.true;
      expect(await registry.isUniversityActive(university1.address)).to.be.true;
      expect(await registry.totalUniversitiesRegistered()).to.equal(1);

      const uni = await registry.getUniversity(university1.address);
      expect(uni.name).to.equal("Massachusetts Institute of Technology");
      expect(uni.code).to.equal("MIT");
      expect(uni.isActive).to.be.true;
      expect(uni.exists).to.be.true;
    });

    it("Non-admin cannot register a university", async function () {
      await expect(
        registry.connect(outsider).registerUniversity(university1.address, "MIT", "MIT")
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("Admin can suspend and reactivate a university", async function () {
      await registry.connect(admin).registerUniversity(university1.address, "MIT", "MIT");
      const UNIVERSITY_ROLE = await registry.UNIVERSITY_ROLE();

      // Suspend
      await registry.connect(admin).setUniversityStatus(university1.address, false);
      expect(await registry.isUniversityActive(university1.address)).to.be.false;
      expect(await registry.hasRole(UNIVERSITY_ROLE, university1.address)).to.be.false;

      // Reactivate
      await registry.connect(admin).setUniversityStatus(university1.address, true);
      expect(await registry.isUniversityActive(university1.address)).to.be.true;
      expect(await registry.hasRole(UNIVERSITY_ROLE, university1.address)).to.be.true;
    });
  });

  describe("Certificate Issuance", function () {
    beforeEach(async function () {
      await registry.connect(admin).registerUniversity(university1.address, "MIT", "MIT");
    });

    it("Authorized university can issue a certificate", async function () {
      await expect(
        registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash)
      )
        .to.emit(registry, "CertificateIssued")
        .withArgs(sampleCertId, sampleDocHash, university1.address, (v: any) => !!v);

      expect(await registry.totalCertificatesIssued()).to.equal(1);

      const cert = await registry.getCertificate(sampleCertId);
      expect(cert.certificateHash).to.equal(sampleDocHash);
      expect(cert.issuer).to.equal(university1.address);
      expect(cert.exists).to.be.true;
      expect(cert.revoked).to.be.false;
    });

    it("Unauthorized account cannot issue certificates", async function () {
      await expect(
        registry.connect(outsider).issueCertificate(sampleCertId, sampleDocHash)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("Suspended university cannot issue certificates", async function () {
      await registry.connect(admin).setUniversityStatus(university1.address, false);

      await expect(
        registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash)
      ).to.be.revertedWithCustomError(registry, "AccessControlUnauthorizedAccount");
    });

    it("Cannot issue certificate with duplicate certId", async function () {
      await registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash);

      const differentDocHash = ethers.sha256(ethers.toUtf8Bytes("DIFFERENT"));
      await expect(
        registry.connect(university1).issueCertificate(sampleCertId, differentDocHash)
      ).to.be.revertedWithCustomError(registry, "CertificateAlreadyExists");
    });

    it("Cannot issue duplicate document hash", async function () {
      await registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash);

      const newCertId = stringToBytes32("CERT-2026-CS-0002");
      await expect(
        registry.connect(university1).issueCertificate(newCertId, sampleDocHash)
      ).to.be.revertedWithCustomError(registry, "CertificateHashAlreadyRegistered");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await registry.connect(admin).registerUniversity(university1.address, "MIT", "MIT");
      await registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash);
    });

    it("Correct certId and hash verify successfully", async function () {
      const [isValid, isRevoked, issuer, issuedAt] = await registry.verifyCertificate(
        sampleCertId,
        sampleDocHash
      );

      expect(isValid).to.be.true;
      expect(isRevoked).to.be.false;
      expect(issuer).to.equal(university1.address);
      expect(issuedAt).to.be.gt(0);
    });

    it("Altered document hash fails verification", async function () {
      const tamperedHash = ethers.sha256(ethers.toUtf8Bytes("TAMPERED_CONTENT"));
      const [isValid, isRevoked] = await registry.verifyCertificate(sampleCertId, tamperedHash);

      expect(isValid).to.be.false;
      expect(isRevoked).to.be.false;
    });

    it("Non-existent certificate returns false", async function () {
      const nonExistentId = stringToBytes32("NOT-FOUND-ID");
      const [isValid, isRevoked, issuer] = await registry.verifyCertificate(
        nonExistentId,
        sampleDocHash
      );

      expect(isValid).to.be.false;
      expect(isRevoked).to.be.false;
      expect(issuer).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Revocation", function () {
    beforeEach(async function () {
      await registry.connect(admin).registerUniversity(university1.address, "MIT", "MIT");
      await registry.connect(university1).issueCertificate(sampleCertId, sampleDocHash);
    });

    it("Issuing university can revoke its certificate with reason", async function () {
      const reason = "Degree recalled due to academic integrity committee decision";
      await expect(
        registry.connect(university1).revokeCertificate(sampleCertId, reason)
      )
        .to.emit(registry, "CertificateRevoked")
        .withArgs(sampleCertId, university1.address, reason, (v: any) => !!v);

      expect(await registry.totalCertificatesRevoked()).to.equal(1);

      // Verify certificate now fails
      const [isValid, isRevoked] = await registry.verifyCertificate(sampleCertId, sampleDocHash);
      expect(isValid).to.be.false;
      expect(isRevoked).to.be.true;

      const cert = await registry.getCertificate(sampleCertId);
      expect(cert.revoked).to.be.true;
      expect(cert.revocationReason).to.equal(reason);
      expect(cert.revokedAt).to.be.gt(0);
    });

    it("Super Admin can revoke any certificate", async function () {
      const reason = "Administrative compliance audit";
      await registry.connect(admin).revokeCertificate(sampleCertId, reason);

      const cert = await registry.getCertificate(sampleCertId);
      expect(cert.revoked).to.be.true;
    });

    it("Unauthorized account cannot revoke a certificate", async function () {
      await expect(
        registry.connect(outsider).revokeCertificate(sampleCertId, "Malicious attempt")
      ).to.be.revertedWithCustomError(registry, "UnauthorizedRevoker");
    });

    it("Cannot revoke an already revoked certificate", async function () {
      await registry.connect(university1).revokeCertificate(sampleCertId, "Reason 1");

      await expect(
        registry.connect(university1).revokeCertificate(sampleCertId, "Reason 2")
      ).to.be.revertedWithCustomError(registry, "CertificateAlreadyRevoked");
    });
  });
});
