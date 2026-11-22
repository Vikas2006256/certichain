import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "certichain-super-secret-jwt-key-change-in-production-2026-secure"
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "STUDENT";
  name: string;
  universityId?: string | null;
  walletAddress?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(request?: NextRequest): Promise<JWTPayload | null> {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("certichain_session")?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = cookies();
    token = cookieStore.get("certichain_session")?.value;
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(
  request: NextRequest,
  allowedRoles?: ("SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "STUDENT")[]
): Promise<{ user: JWTPayload | null; errorResponse: Response | null }> {
  const user = await getSessionUser(request);

  if (!user) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: "Unauthorized. Please log in." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: new Response(
        JSON.stringify({ error: "Forbidden. Insufficient permissions." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { user, errorResponse: null };
}
