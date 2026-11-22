import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role = "STUDENT", studentIdNumber, universityId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role: role === "UNIVERSITY_ADMIN" ? "UNIVERSITY_ADMIN" : "STUDENT",
        universityId: universityId || null,
      },
    });

    // If student, link student profile
    if (newUser.role === "STUDENT" && universityId && studentIdNumber) {
      await prisma.student.create({
        data: {
          userId: newUser.id,
          studentIdNumber: studentIdNumber.trim(),
          universityId,
          department: body.department || "General Studies",
          program: body.program || "Degree Program",
        },
      });
    }

    const token = await generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
      name: newUser.name,
      universityId: newUser.universityId,
    });

    const response = NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    });

    response.cookies.set("certichain_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register account." },
      { status: 500 }
    );
  }
}
