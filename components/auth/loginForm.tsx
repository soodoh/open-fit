"use client";

import { signIn } from "@/actions/signIn";
import { Button, Container, TextField } from "@mui/material";
import { useActionState } from "react";

export const LoginForm = () => {
  const [state, action, isPending] = useActionState(signIn, {
    email: "",
    password: "",
  });

  return (
    <Container
      maxWidth="xs"
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      component="form"
      action={action}
    >
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        variant="outlined"
        label="Email"
        name="email"
        error={!!state.errors?.email}
        helperText={state.errors?.email?.[0]}
        defaultValue={state.email}
      />
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        name="password"
        error={!!state.errors?.password}
        helperText={state.errors?.password?.[0]}
        defaultValue={state.password}
      />
      <Button variant="contained" disabled={isPending} type="submit" fullWidth>
        Log In
      </Button>
    </Container>
  );
};
