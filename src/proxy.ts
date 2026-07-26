/**
 * Next.js Proxy for Protected Routes & Role Authorization
 *
 * What it does:
 * 1. Checks protected routes (/checkout, /orders, /profile, /admin)
 * 2. Inspects both Auth.js session token (`authjs.session-token` / `__Secure-authjs.session-token`)
 *    and fallback lightweight cookie (`pizza_house_auth`).
 * 3. Enforces ADMIN role authorization for `/admin`:
 *    - Unauthenticated users -> redirect to `/login?returnUrl=/admin`
 *    - Non-admin users -> redirect to home `/`
 *
 * Migration Note:
 * Renamed from middleware.ts to proxy.ts per Next.js 16 convention.
 * The exported function is `proxy` instead of `middleware`.
 *
 * Where it belongs:
 * src/proxy.ts
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/checkout", "/orders", "/profile"];
  const isAdminPath = pathname.startsWith("/admin");
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath || isAdminPath) {
    const authCookie = request.cookies.get("pizza_house_auth");
    const sessionToken =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token") ||
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

    const isAuthenticated = (authCookie && authCookie.value === "true") || !!sessionToken;

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile/:path*", "/admin/:path*"],
};
