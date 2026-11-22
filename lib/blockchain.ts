import { ethers } from "ethers";
import contractArtifact from "./contracts/CertificateRegistry.json";

// Public RPC provider for reading verified on-chain status
const RPC_URL = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  contractArtifact.address ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getPublicProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getReadOnlyContract(provider?: ethers.Provider): ethers.Contract {
  const rpcProvider = provider || getPublicProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, rpcProvider);
}

/**
 * Returns an authenticated server-side signer for automated relay or administrative actions.
 */
export function getServerSigner(): ethers.Wallet | null {
  const privateKey = process.env.BLOCKCHAIN_SIGNER_PRIVATE_KEY;
  if (!privateKey) {
    console.warn("BLOCKCHAIN_SIGNER_PRIVATE_KEY not configured.");
    return null;
  }
  const provider = getPublicProvider();
  return new ethers.Wallet(privateKey, provider);
}

export function getSigningContract(): ethers.Contract | null {
  const signer = getServerSigner();
  if (!signer) return null;
  return new ethers.Contract(CONTRACT_ADDRESS, contractArtifact.abi, signer);
}

/**
 * Converts string identifier (e.g. "CERT-2026-CS-8894") to 32-byte hash format used in Solidity
 */
export function certIdToBytes32(certId: string): string {
  // If already 0x with 64 hex characters (32 bytes)
  if (certId.startsWith("0x") && certId.length === 66) {
    return certId;
  }
  return ethers.keccak256(ethers.toUtf8Bytes(certId));
}

/**
 * Verifies certificate directly on Ethereum smart contract
 */
export async function verifyCertificateOnChain(
  certId: string,
  certificateHash: string
): Promise<{
  isValid: boolean;
  isRevoked: boolean;
  issuer: string;
  issuedAt: number;
  onChainHash?: string;
  revocationReason?: string;
  exists: boolean;
}> {
  try {
    const contract = getReadOnlyContract();
    const certIdBytes32 = certIdToBytes32(certId);

    // Call verifyCertificate on-chain
    const result = await contract.verifyCertificate(certIdBytes32, certificateHash);
    const isValid = Boolean(result[0]);
    const isRevoked = Boolean(result[1]);
    const issuer = String(result[2]);
    const issuedAt = Number(result[3]);

    let revocationReason = "";
    let exists = false;
    let onChainHash = "";

    try {
      const fullCert = await contract.getCertificate(certIdBytes32);
      onChainHash = fullCert[0];
      exists = Boolean(fullCert[3]);
      revocationReason = fullCert[5] || "";
    } catch {
      // Ignored if contract doesn't return full struct
    }

    return {
      isValid,
      isRevoked,
      issuer,
      issuedAt,
      onChainHash,
      revocationReason,
      exists,
    };
  } catch (error) {
    console.error("Blockchain verification error:", error);
    throw error;
  }
}
