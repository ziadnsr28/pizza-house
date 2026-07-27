import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
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
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.phone = user.phone;
        token.address = user.address;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") || "USER";
        session.user.phone = token.phone as string | undefined;
        session.user.address = token.address as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
