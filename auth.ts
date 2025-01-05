import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) {
          throw new Error("Invalid credentials.");
        }

        const passwordCorrect = await compare(
          credentials.password,
          user.password,
        );
        if (!passwordCorrect) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          password: user.password,
        };
      },
    }),
  ],
});
