"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateRoutine } from "@/components/routines/CreateRoutine";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { Container } from "@/components/ui/container";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dumbbell } from "lucide-react";

export default function Routines() {
  return (
    <AuthGuard>
      <RoutinesContent />
    </AuthGuard>
  );
}

function RoutinesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-6">
        <Dumbbell className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No routines yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Create your first workout routine to start tracking your fitness
        journey. Organize your workouts by day and build consistent habits.
      </p>
      <CreateRoutine variant="empty-state" />
    </div>
  );
}

function RoutinesContent() {
  const routines = useQuery(api.queries.routines.list);
  const currentSession = useQuery(api.queries.sessions.getCurrent);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Routines
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your workout routines and training schedules
              </p>
            </div>
            {routines && routines.length > 0 && <CreateRoutine />}
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container maxWidth="xl" className="py-8">
        {/* Resume Session Banner */}
        {currentSession && (
          <div className="mb-8">
            <ResumeSessionButton session={currentSession} />
          </div>
        )}

        {/* Loading State */}
        {routines === undefined && <RoutinesSkeleton />}

        {/* Empty State */}
        {routines && routines.length === 0 && <EmptyState />}

        {/* Routines Grid */}
        {routines && routines.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {routines.map((routine) => (
              <RoutineCard
                key={routine._id}
                routine={routine}
                currentSession={currentSession}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
