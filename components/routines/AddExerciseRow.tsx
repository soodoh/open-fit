import { AutocompleteExercise } from "@/components/exercises/AutocompleteExercise";
import { Add } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
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
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      component="form"
      action={handleSubmit}
    >
      <Box sx={{ minWidth: 150, maxWidth: 400, flexGrow: 1 }}>
        <AutocompleteExercise
          value={exercise}
          onChange={(newExercise) => setExercise(newExercise)}
        />
      </Box>
      <TextField
        variant="outlined"
        type="number"
        label="Sets"
        value={numSets}
        onChange={(event) => setNumSets(event.target.value)}
        slotProps={{
          htmlInput: { min: 1 },
        }}
        sx={{ minWidth: 50, maxWidth: 75 }}
      />
      <IconButton type="submit">
        <Add />
      </IconButton>
    </Box>
  );
};
