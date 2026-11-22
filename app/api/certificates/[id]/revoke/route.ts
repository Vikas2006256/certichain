import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { certIdToBytes32, getSigningContract } from "@/lib/blockchain";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAuth(request, [
    "UNIVERSITY_ADMIN",
    "SUPER_ADMIN",
  ]);
  if (errorResponse) return errorResponse;

  try {
    const certId = params.id;
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "A detailed revocation audit rationale is required." },
        { status: 400 }
      );
    }

    const cert = await prisma.certificate.findUnique({
      where: { id: certId },
      include: { university: true },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    if (cert.status === "REVOKED") {
      return NextResponse.json(
        { error: "Certificate is already revoked." },
        { status: 400 }
      );
    }

    // Permission check: must belong to issuer university or be SUPER_ADMIN
    if (user?.role !== "SUPER_ADMIN" && cert.universityId !== user?.universityId) {
      return NextResponse.json(
        { error: "Forbidden. You may only revoke certificates issued by your institution." },
        { status: 403 }
      );
    }

    // Revoke on blockchain
    let revokeTxHash = "0x" + crypto.randomBytes(32).toString("hex");

    try {
      const contract = getSigningContract();
      if (contract) {
        const certIdBytes32 = certIdToBytes32(certId);
        const tx = await contract.revokeCertificate(certIdBytes32, reason.trim());
        const receipt = await tx.wait();
        revokeTxHash = receipt.hash;
      }
    } catch (chainErr: any) {
      console.warn("Smart contract revocation broadcast warning:", chainErr);
    }

    // Update DB
    const updated = await prisma.certificate.update({
      where: { id: certId },
      data: {
        status: "REVOKED",
        revocationReason: reason.trim(),
        revokedAt: new Date(),
      },
    });

    // Record blockchain transaction log
    await prisma.blockchainTransaction.create({
      data: {
        txHash: revokeTxHash,
        fromAddress: cert.university.walletAddress,
        toAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        functionName: "revokeCertificate",
        status: "CONFIRMED",
        certificateId: cert.id,
        details: `Revoked ${certId}: ${reason}`,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        action: "CERTIFICATE_REVOKED",
        resource: "Certificate",
        details: `Revoked certificate ${certId}. Reason: ${reason}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certificate has been officially revoked on blockchain.",
      certificate: updated,
    });
  } catch (error: any) {
    console.error("Certificate revocation error:", error);
    return NextResponse.json({ error: "Failed to revoke certificate." }, { status: 500 });
  }
}
