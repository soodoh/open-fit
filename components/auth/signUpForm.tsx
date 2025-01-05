"use client";

import { signUp } from "@/actions/signUp";
import { Button, Container, TextField } from "@mui/material";
import { useActionState } from "react";

export const SignUpForm = () => {
  const [state, action, isPending] = useActionState(signUp, {
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
        name="email"
        label="Email"
        variant="outlined"
        error={!!state.errors?.email}
        helperText={state.errors?.email?.[0]}
        defaultValue={state.email}
      />
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        name="password"
        label="Password"
        variant="outlined"
        type="password"
        error={!!state.errors?.password}
        helperText={state.errors?.password?.[0]}
        defaultValue={state.password}
      />
      <Button variant="contained" disabled={isPending} type="submit" fullWidth>
        Submit
      </Button>
    </Container>
  );
};
