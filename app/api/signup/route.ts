import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/prisma/generated/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { NextRequest } from "next/server";

const SignUpSchema = z.object({
  email: z.email({ message: "Must be a valid email address" }),
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

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const validatedFields = SignUpSchema.safeParse({
    email,
    password,
  });

  if (validatedFields.error) {
    const errors = z.treeifyError(validatedFields.error);
    return Response.json(
      {
        errors: {
          email: errors.properties?.email?.errors[0] ?? "",
          password: errors.properties?.password?.errors[0] ?? "",
        },
      },
      { status: 500 },
    );
  }

  // Check if the username already exists
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  if (userExists) {
    return Response.json(
      {
        errors: {
          email: "Email already exists.",
        },
      },
      { status: 500 },
    );
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

  return Response.json({ success: true });
}
