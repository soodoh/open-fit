"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateRoutine } from "@/components/routines/CreateRoutine";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { Container } from "@/components/ui/container";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function Routines() {
  return (
    <AuthGuard>
      <RoutinesContent />
    </AuthGuard>
  );
}

function RoutinesContent() {
  const routines = useQuery(api.queries.routines.list);
  const currentSession = useQuery(api.queries.sessions.getCurrent);

  if (routines === undefined) {
    return (
      <Container maxWidth="xl" className="my-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Routines</h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="my-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Routines</h1>
        <CreateRoutine />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {currentSession && (
          <div className="col-span-full">
            <ResumeSessionButton session={currentSession} />
          </div>
        )}
        {routines?.map((routine) => (
          <RoutineCard
            key={routine._id}
            routine={routine}
            currentSession={currentSession}
          />
        ))}
      </div>
    </Container>
  );
}
