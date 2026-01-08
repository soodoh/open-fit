"use client";

import { Container } from "@/components/ui/container";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <p className="text-muted-foreground">Loading...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
