"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <AuthGuard>
      <Container maxWidth="xl" className="mt-8">
        TODO home page dashboard
      </Container>
    </AuthGuard>
  );
}
