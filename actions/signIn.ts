"use server";

import { z } from "zod";
import { signIn as auth } from "@/auth";

const SignInSchema = z.object({
  email: z.string().email({ message: "Must be a valid email address" }),
  password: z.string(),
});

export type SignInActionState = {
  email?: string;
  password?: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signIn(
  _prevState: SignInActionState,
  form: FormData,
): Promise<SignInActionState> {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const validatedFields = SignInSchema.safeParse({
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

  try {
    await auth("credentials", { email, password });
    return { email: "", password: "" };
  } catch (err) {
    console.log(err);
    return {
      email,
      password,
      errors: {
        email: ["Invalid credentials."],
      },
    };
  }
}
