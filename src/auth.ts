import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { isDatabaseConfigured } from "@/lib/utils";
import { getMockUserByEmail } from "@/mocks/data";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email);
        const password = String(credentials.password);

        if (!isDatabaseConfigured()) {
          const mockUser = getMockUserByEmail(email);
          if (!mockUser || password !== "fl123456") return null;
          return { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role };
        }

        try {
          const { prisma } = await import("@/lib/prisma");
          const { compareSync } = await import("bcryptjs");

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !compareSync(password, user.passwordHash)) return null;

          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});
