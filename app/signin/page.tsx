"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/container";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Container
        maxWidth="sm"
        className="flex flex-1 items-center justify-center"
      >
        <p className="text-muted-foreground">Loading...</p>
      </Container>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <LoginForm />;
}
