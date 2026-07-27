import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";
const isGoogleConfigured = Boolean(
  googleClientId &&
    googleClientSecret &&
    !googleClientId.startsWith("your-") &&
    !googleClientSecret.startsWith("your-")
);

const providers = [
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
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const email = String(credentials.email).trim().toLowerCase();
      const password = String(credentials.password);
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user?.password || !(await bcrypt.compare(password, user.password))) {
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
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const databaseUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, phone: true, address: true },
        });

        token.id = user.id;
        token.role = (databaseUser?.role as "USER" | "ADMIN") || "USER";
        token.phone = databaseUser?.phone || undefined;
        token.address = databaseUser?.address || undefined;
      }

      if (trigger === "update" && typeof token.id === "string") {
        const databaseUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, phone: true, address: true },
        });
        token.role = (databaseUser?.role as "USER" | "ADMIN") || "USER";
        token.phone = databaseUser?.phone || undefined;
        token.address = databaseUser?.address || undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") || "USER";
        session.user.phone = token.phone as string | undefined;
        session.user.address = token.address as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
});
