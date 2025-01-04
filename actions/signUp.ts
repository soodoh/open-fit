"use server";

import { z } from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Be at least 3 characters long" })
    .max(20, { message: "Be at most 20 characters long" }),
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
  newUserId?: number;
  username?: string;
  password?: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
};

export async function signUp(
  _prevState: SignUpActionState,
  form: FormData,
): Promise<SignUpActionState> {
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const validatedFields = SignUpSchema.safeParse({
    username,
    password,
  });

  if (!validatedFields.success) {
    return {
      username,
      password,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Check if the username already exists
  const userExists = await db.query("SELECT 1 FROM users WHERE username = $1", [
    username,
  ]);
  if (!!userExists?.rowCount) {
    return {
      username,
      password,
      errors: {
        username: ["Username already exists."],
      },
    };
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert the new user into the database
  const result = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
    [username, hashedPassword],
  );

  return { newUserId: result.rows[0].id };
}
