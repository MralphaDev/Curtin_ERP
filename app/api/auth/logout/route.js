import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  res.cookies.set("token", "", {
    path: "/",          // 必须一致
    maxAge: 0,          // 立即过期
    expires: new Date(0) // 🔥 强制过期（关键）
  });

  return res;
}