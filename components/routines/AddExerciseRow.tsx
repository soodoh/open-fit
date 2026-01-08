"use client";

import { AutocompleteExercise } from "@/components/exercises/AutocompleteExercise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import type {
  Exercise,
  RoutineDayId,
  WorkoutSessionId,
} from "@/lib/convex-types";

export const AddExerciseRow = ({
  sessionOrDayId,
  isSession,
}: {
  sessionOrDayId: RoutineDayId | WorkoutSessionId;
  isSession: boolean;
}) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [numSets, setNumSets] = useState<string>("1");

  const createSetGroup = useMutation(api.mutations.setGroups.create);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!exercise) {
      return;
    }
    await createSetGroup({
      sessionOrDayId,
      isSession,
      type: "NORMAL",
      exerciseId: exercise._id,
      numSets: parseInt(numSets, 10),
    });
    setExercise(null);
    setNumSets("1");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 flex-wrap">
      <div className="min-w-[150px] max-w-[400px] flex-grow">
        <AutocompleteExercise
          value={exercise}
          onChange={(newExercise) => setExercise(newExercise)}
        />
      </div>
      <div className="min-w-[50px] max-w-[75px]">
        <Input
          type="number"
          placeholder="Sets"
          value={numSets}
          onChange={(event) => setNumSets(event.target.value)}
          min={1}
        />
      </div>
      <Button type="submit" size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};
