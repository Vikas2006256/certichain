import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, errorResponse } = await requireAuth(request, ["SUPER_ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const universityId = params.id;
    const body = await request.json();
    const { status } = body;

    if (!["APPROVED", "SUSPENDED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.university.update({
      where: { id: universityId },
      data: { status },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        action: `UNIVERSITY_STATUS_${status}`,
        resource: "University",
        details: `Updated university ${updated.name} status to ${status}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, university: updated });
  } catch (error: any) {
    console.error("Update university status error:", error);
    return NextResponse.json({ error: "Failed to update university status" }, { status: 500 });
  }
}
