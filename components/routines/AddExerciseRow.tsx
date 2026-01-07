import { AutocompleteExercise } from "@/components/exercises/AutocompleteExercise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "@/prisma/generated/client";

export const AddExerciseRow = ({
  sessionOrDayId,
  type,
}: {
  sessionOrDayId: number;
  type: "session" | "routineDay";
}) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [numSets, setNumSets] = useState<string>("1");

  const handleSubmit = async () => {
    if (!exercise) {
      return;
    }
    await fetch("/api/setgroup", {
      method: "POST",
      body: JSON.stringify({
        sessionOrDayId,
        type,
        exerciseId: exercise.id,
        numSets: parseInt(numSets, 10),
      }),
    });
  };

  return (
    <form action={handleSubmit} className="flex items-center gap-4 flex-wrap">
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
