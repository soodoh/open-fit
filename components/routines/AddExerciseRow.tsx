import { Box, IconButton, TextField } from "@mui/material";
import { AutocompleteExercise } from "../exercises/AutocompleteExercise";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import { Exercise } from "@prisma/client";
import { createSetGroup } from "@/actions/createSetGroup";

export const AddExerciseRow = ({ dayId }: { dayId: number }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [numSets, setNumSets] = useState<string>("1");

  const handleSubmit = async () => {
    if (!exercise) {
      return;
    }
    await createSetGroup(dayId, exercise.id, parseInt(numSets, 10));
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
