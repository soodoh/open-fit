"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { Container } from "@/components/ui/container";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarDays } from "lucide-react";

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

  const isLoading = sessions === undefined;

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Workout Logs
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your progress and review past sessions
              </p>
            </div>
            {sessions && sessions.length > 0 && <CreateSessionButton />}
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
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && sessions && sessions.length === 0 && <EmptyState />}

        {/* Sessions Grid */}
        {sessions && sessions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionSummaryCard key={session._id} session={session} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-48 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mb-6">
        <CalendarDays className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No workout logs yet
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start your first workout session to begin tracking your fitness journey.
        Log your exercises, track progress, and build consistent habits.
      </p>
      <CreateSessionButton />
    </div>
  );
}
