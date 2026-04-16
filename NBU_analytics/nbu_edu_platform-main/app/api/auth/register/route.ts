import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";
import type { RegisterErrorCode } from "@/lib/auth/auth-copy";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

interface RegisterBody {
  email: string;
  password: string;
  full_name: string;
}

function errorResponse(errorCode: RegisterErrorCode, status: number) {
  return NextResponse.json({ errorCode }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody;

    if (!body.email || !body.password || !body.full_name) {
      return errorResponse("missing_fields", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return errorResponse("invalid_email", 400);
    }

    if (body.password.length < 6) {
      return errorResponse("password_too_short", 400);
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    });
    if (existing) {
      return errorResponse("email_taken", 409);
    }

    const [user] = await db
      .insert(users)
      .values({
        email: body.email,
        passwordHash: hashSync(body.password, 10),
        fullName: body.full_name,
        role: "student",
      })
      .returning();

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return errorResponse("registration_failed", 500);
  }
}
