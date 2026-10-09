import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY || "dummy",
      from: "onboarding@resend.dev",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // The role field isn't natively on user type without module augmentation, but we can append it:
        (session.user as any).role = (user as any).role;
      }
      return session;
    },
  },
  session: { strategy: "database" },
});
