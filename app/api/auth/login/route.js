import { NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";

export async function POST(req) {
  const { username, password } = await req.json();

  const token = loginUser(username, password);

  const res = NextResponse.json({ ok: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return res;
}
/*import { NextResponse } from "next/server";

import { signToken } from "@/lib/auth/jwt";

export async function POST(req) {
  const { username, password } = await req.json();

  // temporary auth (replace later with DB)
  if (username !== "admin" || password !== "123") {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = signToken({
    userId: 1,
    role: "tier1",
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
  });

  return res;
}*/