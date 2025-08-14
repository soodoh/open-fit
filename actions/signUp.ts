"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/prisma/generated/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const SignUpSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .max(64, { message: "Be at most 64 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter" })
    .regex(/[0-9]/, { message: "Contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character",
    })
    .trim(),
});

export type SignUpActionState = {
  email?: string;
  password?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signUp(
  _prevState: SignUpActionState,
  form: FormData,
): Promise<SignUpActionState> {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const validatedFields = SignUpSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      email,
      password,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Check if the username already exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  if (userExists) {
    return {
      email,
      password,
      errors: {
        email: ["Email already exists."],
      },
    };
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert the new user into the database
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: Role.USER,
    },
  });
  // Log in
  await signIn("credentials", { email, password });

  return { email: "", password: "" };
}
