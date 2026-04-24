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
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`; // 🔥 hard correct path
    return NextResponse.redirect(url, 308);
  }

  // 🔁 6. Prevent logged-in users from going back to login page
  if (isLogin && token) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url, 308);
  }

  // ✅ 7. Allow request to continue normally
  return NextResponse.next();
}

// 🌐 8. Match only real app routes (IMPORTANT for performance & memory)
export const config = {
  matcher: [
    "/:locale((?!_next|api|favicon.ico).*)",
  ],
};
/*
//mistake here: the middleware goes to https://gsvi.cc/dashboard/login instead of https://gsvi.cc/login when the user is not logged in. This is because the middleware is trying to redirect to the dashboard page instead of the login page when the user is not authenticated. To fix this, we need to change the redirect URL in the middleware to point to the login page instead of the dashboard page.
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

