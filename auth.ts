import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/lib/utils/env";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "ADMIN" | "USER";
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  callbacks: {
    jwt({ token }) {
      token.role = token.email?.toLowerCase() === env.adminEmail ? "ADMIN" : "USER";
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      return session;
    }
  },
  pages: {
    signIn: "/admin"
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
});
