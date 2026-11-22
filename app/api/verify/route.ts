import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCertificateOnChain } from "@/lib/blockchain";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let certId = "";
    let uploadedFileHash: string | null = null;
    let method = "SEARCH";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      certId = (formData.get("certId") as string) || "";
      method = (formData.get("method") as string) || "FILE_UPLOAD";

      const file = formData.get("file") as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        uploadedFileHash = "0x" + crypto.createHash("sha256").update(buffer).digest("hex");
      }
    } else {
      const body = await request.json();
      certId = body.certId || "";
      method = body.method || "SEARCH";
      if (body.hash) {
        uploadedFileHash = body.hash;
      }
    }

    certId = certId.trim();

    if (!certId && !uploadedFileHash) {
      return NextResponse.json(
        { error: "Certificate ID or document file is required for verification." },
        { status: 400 }
      );
    }

    // 1. Look up certificate in database
    let certificate = null;

    if (certId) {
      certificate = await prisma.certificate.findUnique({
        where: { id: certId },
        include: {
          university: true,
        },
      });
    }

    // If searched by hash
    if (!certificate && uploadedFileHash) {
      certificate = await prisma.certificate.findUnique({
        where: { certHash: uploadedFileHash },
        include: {
          university: true,
        },
      });
      if (certificate) {
        certId = certificate.id;
      }
    }

    // If certificate does not exist in registry
    if (!certificate) {
      return NextResponse.json(
        {
          verified: false,
          status: "NOT_FOUND",
          message: "No certificate record found with the provided identifier or cryptographic fingerprint.",
        },
        { status: 404 }
      );
    }

    // 2. Validate document hash
    const expectedHash = certificate.certHash;
    let hashMatches = true;

    if (uploadedFileHash) {
      hashMatches = (uploadedFileHash.toLowerCase() === expectedHash.toLowerCase());
      if (!hashMatches) {
        // Record failed log
        await prisma.verificationLog.create({
          data: {
            certificateId: certificate.id,
            verifiedByIp: request.headers.get("x-forwarded-for") || "127.0.0.1",
            userAgent: request.headers.get("user-agent") || "Web Client",
            method,
            isValid: false,
            resultStatus: "HASH_MISMATCH",
            verificationHash: uploadedFileHash,
          },
        });

        return NextResponse.json({
          verified: false,
          status: "HASH_MISMATCH",
          message: "Document hash mismatch. The uploaded file has been modified or forged.",
          proof: {
            uploadedFileHash,
            expectedHash,
            hashMatches: false,
          },
          certificate: {
            id: certificate.id,
            title: certificate.title,
            universityName: certificate.university.name,
          },
        });
      }
    }

    // 3. Query on-chain smart contract
    let onChainProof: any = null;
    let blockchainAvailable = true;

    try {
      const chainResult = await verifyCertificateOnChain(certificate.id, expectedHash);
      onChainProof = chainResult;
    } catch (chainErr) {
      console.warn("Smart contract read warning (using recorded tx proof):", chainErr);
      blockchainAvailable = false;
    }

    // 4. Check revocation status
    const isRevoked =
      certificate.status === "REVOKED" || (onChainProof && onChainProof.isRevoked);

    const isVerified =
      !isRevoked && hashMatches && (onChainProof ? onChainProof.isValid : true);

    const resultStatus = isRevoked
      ? "REVOKED"
      : isVerified
      ? "VERIFIED"
      : "INVALID";

    // 5. Save verification log
    await prisma.verificationLog.create({
      data: {
        certificateId: certificate.id,
        verifiedByIp: request.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: request.headers.get("user-agent") || "Web Client",
        method,
        isValid: isVerified,
        resultStatus,
        verificationHash: uploadedFileHash || expectedHash,
      },
    });

    return NextResponse.json({
      verified: isVerified,
      status: resultStatus,
      blockchainAvailable,
      certificate: {
        id: certificate.id,
        title: certificate.title,
        recipientName: certificate.recipientName,
        studentIdNumber: certificate.studentIdNumber,
        universityName: certificate.university.name,
        universityCode: certificate.university.code,
        universityAddress: certificate.university.walletAddress,
        department: certificate.department,
        grade: certificate.grade,
        description: certificate.description,
        issueDate: certificate.issueDate,
        certHash: certificate.certHash,
        txHash: certificate.txHash,
        blockNumber: certificate.blockNumber,
        status: certificate.status,
        revocationReason: certificate.revocationReason || onChainProof?.revocationReason,
        revokedAt: certificate.revokedAt,
        qrCodeDataUrl: certificate.qrCodeDataUrl,
        documentUrl: certificate.documentUrl,
      },
      onChainProof: onChainProof || {
        issuer: certificate.university.walletAddress,
        exists: true,
        isValid: isVerified,
        isRevoked: isRevoked,
      },
      verificationTimestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Verification endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to verify certificate. Please try again." },
      { status: 500 }
    );
  }
}
