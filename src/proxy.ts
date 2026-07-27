import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export function proxy(request: Parameters<typeof auth>[0]) {
  return auth(request as never);
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/profile/:path*", "/admin/:path*"],
};
