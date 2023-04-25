import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prismadb";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: "1066221981614-0hhh9a07mjhf64am4jnthho6lg61d017.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};

export default NextAuth({
  ...authOptions,
});
