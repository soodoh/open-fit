"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { Container } from "@/components/ui/container";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Sessions() {
  return (
    <AuthGuard>
      <SessionsContent />
    </AuthGuard>
  );
}

function SessionsContent() {
  const sessions = useQuery(api.queries.sessions.list);
  const currentSession = useQuery(api.queries.sessions.getCurrent);

  if (sessions === undefined) {
    return (
      <Container maxWidth="xl">
        <div className="my-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Workout Logs</h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <div className="my-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Workout Logs</h1>
        <CreateSessionButton />
      </div>

      {currentSession && (
        <div className="my-8">
          <ResumeSessionButton session={currentSession} />
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {sessions.map((session) => (
          <SessionSummaryCard key={session._id} session={session} />
        ))}
      </div>
    </Container>
  );
}
