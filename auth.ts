import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { compare } from "bcrypt";

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
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await db.query(
          "SELECT * FROM users WHERE username=$1",
          [credentials?.username],
        );
        const user = response.rows[0];

        const passwordCorrect = await compare(
          credentials?.password ?? "",
          user.password,
        );

        if (!user || !passwordCorrect) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
});
