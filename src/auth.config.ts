import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  debug: true,
  logger: {
    error(code, ...message) {
      console.error("[AUTH ERROR]", code, ...message);
    },
    warn(code, ...message) {
      console.warn("[AUTH WARN]", code, ...message);
    },
    debug(code, ...message) {
      console.log("[AUTH DEBUG]", code, ...message);
    },
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      try {
        const isLoggedIn = !!auth?.user;
        const { pathname } = nextUrl;
        const protectedPaths = ["/checkout", "/orders", "/profile"];
        const isAdminPath = pathname.startsWith("/admin");
        const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

        if (isProtectedPath || isAdminPath) {
          if (!isLoggedIn) {
            return false; // Redirects to pages.signIn ("/login")
          }
          if (isAdminPath && auth?.user?.role !== "ADMIN") {
            return Response.redirect(new URL("/", nextUrl));
          }
        }
        return true;
      } catch (error) {
        console.error("[AUTH AUTHORIZED CALLBACK ERROR]", error);
        throw error;
      }
    },
    jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role || "USER";
          token.phone = user.phone;
          token.address = user.address;
        }
        return token;
      } catch (error) {
        console.error("[AUTH JWT CALLBACK ERROR]", error);
        throw error;
      }
    },
    session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = (token.role as "USER" | "ADMIN") || "USER";
          session.user.phone = token.phone as string | undefined;
          session.user.address = token.address as string | undefined;
        }
        return session;
      } catch (error) {
        console.error("[AUTH SESSION CALLBACK ERROR]", error);
        throw error;
      }
    },
  },
} satisfies NextAuthConfig;
