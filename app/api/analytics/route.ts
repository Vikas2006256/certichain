import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const [
      totalCertificates,
      issuedCertificates,
      revokedCertificates,
      totalUniversities,
      approvedUniversities,
      totalVerifications,
      validVerifications,
      recentCertificates,
      recentTransactions,
      auditLogs,
    ] = await Promise.all([
      prisma.certificate.count(),
      prisma.certificate.count({ where: { status: "ISSUED" } }),
      prisma.certificate.count({ where: { status: "REVOKED" } }),
      prisma.university.count(),
      prisma.university.count({ where: { status: "APPROVED" } }),
      prisma.verificationLog.count(),
      prisma.verificationLog.count({ where: { isValid: true } }),
      prisma.certificate.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { university: { select: { name: true, code: true } } },
      }),
      prisma.blockchainTransaction.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Monthly chart demo aggregation
    const monthlyIssuance = [
      { month: "Jan", issued: 120, verifications: 450 },
      { month: "Feb", issued: 180, verifications: 620 },
      { month: "Mar", issued: 250, verifications: 890 },
      { month: "Apr", issued: 310, verifications: 1200 },
      { month: "May", issued: 480, verifications: 1780 },
      { month: "Jun", issued: 650, verifications: 2300 },
      { month: "Jul", issued: totalCertificates, verifications: totalVerifications },
    ];

    return NextResponse.json({
      stats: {
        totalCertificates,
        issuedCertificates,
        revokedCertificates,
        totalUniversities,
        approvedUniversities,
        totalVerifications,
        validVerifications,
      },
      charts: {
        monthlyIssuance,
      },
      recentCertificates,
      recentTransactions,
      auditLogs,
    });
  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
