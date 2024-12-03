"use client";
import styles from "./login.module.css";
import { Button, TextField } from "@mui/material";
import { type FormEvent, useState } from "react";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";

import { z } from "zod";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

const LoginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const router = useRouter();
  // Form validation
  const validatedFields = LoginFormSchema.safeParse({
    username,
    password,
  });
  const errors = validatedFields.error?.flatten().fieldErrors;

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatedFields.success) {
      setShowErrors(true);
      return;
    }
    setPending(true);
    const data = await fetcher({
      url: "/token",
      opts: {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      },
    });
    setPending(false);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <form onSubmit={login}>
        <TextField
          className={styles.textField}
          label="Username"
          variant="outlined"
          error={showErrors && !!errors?.username}
          helperText={showErrors && errors?.username?.[0]}
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <TextField
          className={styles.textField}
          label="Password"
          variant="outlined"
          type="password"
          error={showErrors && !!errors?.password}
          helperText={showErrors && errors?.password?.[0]}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <Button variant="contained" disabled={pending} type="submit">
          Log In
        </Button>
      </form>
    </div>
  );
}
