import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
const isGoogleConfigured = Boolean(
  googleClientId &&
    googleClientSecret &&
    !googleClientId.startsWith("your-") &&
    !googleClientSecret.startsWith("your-")
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(isGoogleConfigured
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("[AUTH DEBUG] authorize missing email or password");
            return null;
          }

          const email = String(credentials.email).trim().toLowerCase();
          const password = String(credentials.password);
          console.log("[AUTH DEBUG] authorize searching for email:", email);

          const user = await prisma.user.findUnique({ where: { email } });
          console.log("[AUTH DEBUG] user found in DB:", !!user);

          if (!user) {
            return null;
          }

          console.log("[AUTH DEBUG] user has password hash:", !!user.password);
          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          console.log("[AUTH DEBUG] bcrypt.compare result:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name || undefined,
            email: user.email,
            image: user.image || undefined,
            role: user.role,
            phone: user.phone || undefined,
            address: user.address || undefined,
          };
        } catch (error) {
          console.error("[AUTH AUTHORIZE CREDENTIALS ERROR]", error);
          throw error;
        }
      },
    }),
  ],
  trustHost: true,
});
