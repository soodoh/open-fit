"use client";

import { SignUpSchema } from "@/lib/authSchema";
import { Button, Container, TextField } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { flattenError } from "zod";

export const LoginForm = ({ register }: { register?: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string[]>([]);
  const [passwordError, setPasswordError] = useState<string[]>([]);

  return (
    <Container
      maxWidth="xs"
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
      }}
      component="form"
      onSubmit={async (event) => {
        event.preventDefault();
        const validation = SignUpSchema.safeParse({ email, password });
        if (validation.error) {
          const errors = flattenError(validation.error);
          setEmailError(errors.fieldErrors.email || []);
          setPasswordError(errors.fieldErrors.password || []);
          return;
        }

        setLoading(true);
        const response = await signIn("credentials", {
          email,
          password,
          flow: register ? "register" : "login",
          redirect: false,
        });
        if (response.code) {
          setPasswordError([response.code]);
        } else {
          redirect("/");
        }
        setLoading(false);
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email"
        variant="outlined"
        error={emailError.length > 0}
        helperText={emailError[0]}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        fullWidth
        name="password"
        label="Password"
        variant="outlined"
        type="password"
        error={passwordError.length > 0}
        helperText={passwordError[0]}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" disabled={loading} type="submit" fullWidth>
        {register ? "Register" : "Login"}
      </Button>
      {!register && (
        <Button
          variant="outlined"
          fullWidth
          LinkComponent={Link}
          href="/register"
        >
          Create an account
        </Button>
      )}
    </Container>
  );
};
