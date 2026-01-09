"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/lib/convex-types";
import { Dumbbell } from "lucide-react";
import { useState } from "react";
import { ExerciseDetailModal } from "./ExerciseDetailModal";

// Helper to format enum values for display
function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <ExerciseDetailModal
        exercise={exercise}
        open={showDetail}
        onClose={() => setShowDetail(false)}
      />

      <button
        onClick={() => setShowDetail(true)}
        className="group text-left w-full"
      >
        <div className="relative h-full rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
          {/* Header with image and name */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12 rounded-lg flex-shrink-0">
              {exercise.images[0] ? (
                <AvatarImage
                  src={`/exercises/${exercise.images[0]}`}
                  alt={exercise.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary/60" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {exercise.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatEnumValue(exercise.category)}
              </p>
            </div>
          </div>

          {/* Primary muscles */}
          {exercise.primaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {exercise.primaryMuscles.slice(0, 3).map((muscle) => (
                <Badge
                  key={muscle}
                  variant="secondary"
                  className="text-xs px-2 py-0.5"
                >
                  {formatEnumValue(muscle)}
                </Badge>
              ))}
              {exercise.primaryMuscles.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{exercise.primaryMuscles.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {exercise.equipment && (
              <span>{formatEnumValue(exercise.equipment)}</span>
            )}
            {exercise.level && (
              <>
                {exercise.equipment && <span>•</span>}
                <span>{formatEnumValue(exercise.level)}</span>
              </>
            )}
          </div>
        </div>
      </button>
    </>
  );
};
