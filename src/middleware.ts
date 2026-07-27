import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const protectedPaths = ["/checkout", "/orders", "/profile"];
  const isAdminPath = pathname.startsWith("/admin");
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath || isAdminPath) {
    if (!request.auth?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminPath && request.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile/:path*", "/admin/:path*"],
};
