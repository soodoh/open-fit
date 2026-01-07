"use client";

import { SignUpSchema } from "@/lib/authSchema";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      maxWidth="sm"
      className="flex flex-1 flex-col items-center justify-center gap-4"
    >
      <form
        className="flex w-full max-w-sm flex-col gap-4"
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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={emailError.length > 0 ? "border-destructive" : ""}
          />
          {emailError.length > 0 && (
            <p className="text-sm text-destructive">{emailError[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={passwordError.length > 0 ? "border-destructive" : ""}
          />
          {passwordError.length > 0 && (
            <p className="text-sm text-destructive">{passwordError[0]}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {register ? "Register" : "Login"}
        </Button>

        {!register && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">Create an account</Link>
          </Button>
        )}
      </form>
    </Container>
  );
};
