import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(process.env.SMTP_URL || { jsonTransport: true } as any);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: "no-reply@quittogether.local",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const result = await transporter.sendMail({
          to: identifier,
          from: provider.from as string,
          subject: `Your sign-in link for QuitTogether`,
          text: `Sign in to ${host}\n${url}`,
        });
        // eslint-disable-next-line no-console
        console.log("Login email (dev):", { to: identifier, url, result });
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role ?? "RECIPIENT";
      }
      return session;
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 