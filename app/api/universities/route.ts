import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const universities = await prisma.university.findMany({
      where,
      include: {
        _count: {
          select: {
            certificates: true,
            students: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ universities });
  } catch (error: any) {
    console.error("Universities fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = await requireAuth(request, ["SUPER_ADMIN"]);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { name, code, contactEmail, address, website, walletAddress, description } = body;

    if (!name || !code || !contactEmail || !walletAddress) {
      return NextResponse.json(
        { error: "Name, code, contact email, and wallet address are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.university.findFirst({
      where: {
        OR: [{ code: code.toUpperCase() }, { walletAddress: walletAddress.toLowerCase() }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A university with this code or wallet address already exists." },
        { status: 409 }
      );
    }

    const university = await prisma.university.create({
      data: {
        name,
        code: code.toUpperCase(),
        contactEmail,
        address,
        website,
        walletAddress: walletAddress.toLowerCase(),
        description,
        status: "APPROVED",
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user?.userId,
        action: "UNIVERSITY_REGISTERED",
        resource: "University",
        details: `Registered university ${name} (${code}) with address ${walletAddress}`,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
      },
    });

    return NextResponse.json({ success: true, university });
  } catch (error: any) {
    console.error("Register university error:", error);
    return NextResponse.json({ error: "Failed to register university." }, { status: 500 });
  }
}
