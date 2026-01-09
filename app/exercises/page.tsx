"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dumbbell, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function Exercises() {
  return (
    <AuthGuard>
      <ExercisesContent />
    </AuthGuard>
  );
}

function ExercisesContent() {
  const exercises = useQuery(api.queries.exercises.list);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = exercises === undefined;

  const filteredExercises = useMemo(() => {
    if (!exercises) return undefined;
    if (!searchQuery.trim()) return exercises;
    const query = searchQuery.toLowerCase().trim();
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.primaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(query)
        ) ||
        exercise.category.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-accent/5 to-transparent">
        <Container maxWidth="xl" className="py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Exercises
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and discover exercises for your workouts
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, muscle, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container maxWidth="xl" className="py-8">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Empty State */}
        {!isLoading && exercises && exercises.length === 0 && <EmptyState />}

        {/* No Search Results */}
        {filteredExercises &&
          filteredExercises.length === 0 &&
          exercises &&
          exercises.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                No exercises found
              </h3>
              <p className="text-muted-foreground text-center text-sm">
                No exercises match "{searchQuery}"
              </p>
            </div>
          )}

        {/* Results Count */}
        {filteredExercises && filteredExercises.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            {filteredExercises.length}{" "}
            {filteredExercises.length === 1 ? "exercise" : "exercises"}
            {searchQuery && " found"}
          </p>
        )}

        {/* Exercises Grid */}
        {filteredExercises && filteredExercises.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise._id} exercise={exercise} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
        <Dumbbell className="w-10 h-10 text-primary/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No exercises available
      </h3>
      <p className="text-muted-foreground text-center max-w-md">
        Exercise library is empty. Contact your administrator to seed the
        exercise database.
      </p>
    </div>
  );
}
