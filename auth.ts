import { SignUpSchema } from "@/lib/authSchema";
import { Role } from "@/prisma/generated/client";
import { compare, hash } from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid login credentials";
}
class DupeCreationError extends CredentialsSignin {
  code = "Email already in use";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async ({
        flow,
        email,
        password,
      }: {
        flow?: "login" | "register";
        email?: string;
        password?: string;
      }) => {
        if (!email || !password) {
          throw new InvalidLoginError();
        }

        // Validate the email and password format
        try {
          await SignUpSchema.parseAsync({
            email,
            password,
          });
        } catch {
          throw new InvalidLoginError();
        }

        // Register a new user
        if (flow === "register") {
          // Check if the username already exists
          const userExists = await prisma.user.findUnique({
            where: { email },
          });
          if (userExists) {
            throw new DupeCreationError();
          }

          const saltRounds = 10;
          const hashedPassword = await hash(password, saltRounds);

          // Insert the new user into the database
          return prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              role: Role.USER,
            },
          });
        }

        // Login existing user
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new InvalidLoginError();
        }

        const passwordCorrect = compare(password, user.password);
        if (!passwordCorrect) {
          throw new InvalidLoginError();
        }

        return user;
      },
    }),
  ],
});
