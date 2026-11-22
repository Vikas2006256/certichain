import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCanonicalCertificatePdf } from "@/lib/pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const certId = params.id;

    const cert = await prisma.certificate.findUnique({
      where: { id: certId },
      include: { university: true },
    });

    if (!cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Generate canonical PDF
    const { pdfBytes } = await generateCanonicalCertificatePdf({
      certId: cert.id,
      recipientName: cert.recipientName,
      studentIdNumber: cert.studentIdNumber,
      universityName: cert.university.name,
      universityCode: cert.university.code,
      title: cert.title,
      department: cert.department || undefined,
      grade: cert.grade || undefined,
      description: cert.description || undefined,
      issueDate: cert.issueDate,
    });

    const filename = `${cert.id}_${cert.recipientName.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBytes.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("PDF download error:", error);
    return NextResponse.json({ error: "Failed to generate certificate PDF" }, { status: 500 });
  }
}
