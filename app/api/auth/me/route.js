import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user,
  });
}