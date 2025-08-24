"use client";

import { Button, Container, TextField } from "@mui/material";
import { useState } from "react";

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

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
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        const response = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const { errors } = await response.json();
        if (errors) {
          setErrors(errors);
        }
        setLoading(false);
      }}
    >
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        name="email"
        label="Email"
        variant="outlined"
        error={!!errors?.email}
        helperText={errors?.email}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        sx={{ mb: 3 }}
        fullWidth
        name="password"
        label="Password"
        variant="outlined"
        type="password"
        error={!!errors?.password}
        helperText={errors?.password}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" disabled={loading} type="submit" fullWidth>
        Submit
      </Button>
    </Container>
  );
};
