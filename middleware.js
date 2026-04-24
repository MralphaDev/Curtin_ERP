import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  const token = req.cookies.get("token")?.value;

  const validLocales = ["en", "zh"];

  // 🚨 FIX: only validate locale AFTER skipping assets
  if (!validLocales.includes(locale)) {
    const url = req.nextUrl.clone();
    url.pathname = `/en/login`;
    return NextResponse.redirect(url);
  }

  const isDashboard = pathname.startsWith(`/${locale}/dashboard`);
  const isLogin = pathname.startsWith(`/${locale}/login`);

  // 🚫 protect dashboard only
  if (isDashboard && !token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // 🔁 prevent login if already logged in
  if (isLogin && token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// 🌐 CRITICAL FIX: exclude Next.js internals
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

/*
original v1
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // 🌍 1. Extract locale safely
  // "/en/dashboard" -> ["", "en", "dashboard"]
  const segments = pathname.split("/");
  const locale = segments[1];

  // 🛑 2. Skip invalid or empty locale
  // Prevents weird behavior on routes like "/favicon.ico"
  if (!locale) {
    return NextResponse.next();
  }

  // 🔐 3. Read auth token from cookies
  const token = req.cookies.get("token")?.value;

  // 📊 4. Identify route types
  const isDashboard = pathname.startsWith(`/${locale}/dashboard`);
  const isLogin = pathname.startsWith(`/${locale}/login`);

  // 🚫 5. Protect dashboard route ONLY
  // If user tries to access dashboard without token → redirect to login
  if (isDashboard && !token) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, req.url)
    );
  }

  // 🔁 6. Prevent logged-in users from going back to login page
  // (optional but good UX)
  if (isLogin && token) {
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, req.url)
    );
  }

  // ✅ 7. Allow request to continue normally
  return NextResponse.next();
}

// 🌐 8. Match only real app routes (IMPORTANT for performance & memory)
export const config = {
  matcher: [
    // Match locale routes BUT exclude:
    // - _next (Next.js internals)
    // - api (API routes)
    // - favicon.ico (browser requests)
    "/:locale((?!_next|api|favicon.ico).*)",
  ],
};*/

