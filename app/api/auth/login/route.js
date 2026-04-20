import { NextResponse } from "next/server";
import { loginUser } from "@/lib/services/authService";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const token = loginUser(username, password);

    const res = NextResponse.json({ ok: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
/*import { NextResponse } from "next/server";
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
}*/

