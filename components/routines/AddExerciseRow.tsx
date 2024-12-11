import useSWR, { useSWRConfig } from "swr";
import { useAuthFetcher } from "@/lib/fetcher";
import { ExerciseSearchData } from "@/types/privateApi/exerciseSearch";
import { Box, IconButton, TextField } from "@mui/material";
import { AutocompleteExercise } from "../exercises/AutocompleteExercise";
import { PaginatedResponse } from "@/types/response";
import { type FormEvent, useState } from "react";
import { WorkoutSetType } from "@/types/privateApi/set";
import { Add } from "@mui/icons-material";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";

export const AddExerciseRow = ({ dayId }: { dayId: number }) => {
  const authFetcher = useAuthFetcher();

  const { data: workoutSets, mutate: mutateSets } = useSWR<
    PaginatedResponse<WorkoutSetType>
  >(`/set?exerciseday=${dayId}`, authFetcher);
  const { mutate } = useSWRConfig();

  const [exercise, setExercise] = useState<ExerciseSearchData | null>(null);
  const [numSets, setNumSets] = useState<string>("1");
  const defaultWeightUnit = useDefaultWeightUnit();

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (!exercise) {
      return;
    }

    const totalSets = parseInt(numSets, 10) || 1;
    const newSet = await authFetcher("/set/", {
      method: "POST",
      body: JSON.stringify({
        exerciseday: dayId,
        order: 0,
        sets: totalSets,
      }),
    });
    const newSets = [newSet, ...(workoutSets?.results ?? [])];
    mutateSets({ ...workoutSets, results: newSets });

    // Add settings based on numSets
    const postPromises = [];
    for (let i = 0; i < totalSets; i++) {
      postPromises.push(
        authFetcher("/setting/", {
          method: "POST",
          body: JSON.stringify({
            set: newSet.id,
            exercise_base: exercise.base_id,
            weight: 0,
            weight_unit: defaultWeightUnit,
            reps: 0,
          }),
        }),
      );
    }
    const newSettings = await Promise.all(postPromises);
    mutate(`setting?set=${newSet.id}`, {
      count: totalSets,
      results: newSettings,
    });

    setExercise(null);
  };

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center" }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Box sx={{ minWidth: 200, flexGrow: 1 }}>
        <AutocompleteExercise
          value={exercise}
          onChange={(newExercise) => setExercise(newExercise)}
        />
      </Box>
      <TextField
        variant="outlined"
        type="number"
        label="Sets"
        slotProps={{
          htmlInput: { min: 1 },
        }}
        value={numSets}
        onChange={(event) => setNumSets(event.target.value)}
        sx={{ width: 75 }}
      />
      <IconButton type="submit">
        <Add />
      </IconButton>
    </Box>
  );
};
