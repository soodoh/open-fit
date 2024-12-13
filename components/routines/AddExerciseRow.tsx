import { useSWRConfig } from "swr";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { ExerciseSearchData } from "@/types/privateApi/exerciseSearch";
import { Box, IconButton, TextField } from "@mui/material";
import { AutocompleteExercise } from "../exercises/AutocompleteExercise";
import { PaginatedResponse } from "@/types/response";
import { type FormEvent, useState } from "react";
import { WorkoutSetType } from "@/types/privateApi/set";
import { Add } from "@mui/icons-material";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { getSets, getSettings, SET, SETTING } from "@/lib/urls";
import { Setting } from "@/types/privateApi/setting";

export const AddExerciseRow = ({ dayId }: { dayId: number }) => {
  const authFetcher = useAuthFetcher();

  const { data: workoutSets } = useAuthedSWR<PaginatedResponse<WorkoutSetType>>(
    getSets(dayId),
  );
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
    const setPromise = authFetcher(SET, {
      method: "POST",
      body: JSON.stringify({
        exerciseday: dayId,
        order: 0,
        sets: totalSets,
      }),
    });
    mutate(getSets(dayId), setPromise, {
      populateCache: (newSet: WorkoutSetType, cachedSets) => {
        const newSets = [newSet, ...(workoutSets?.results ?? [])];
        return {
          ...cachedSets,
          count: newSets.length,
          results: newSets,
        };
      },
      revalidate: false,
      rollbackOnError: true,
    });

    // Add settings based on numSets
    const newSet = await setPromise;
    const postPromises = [];
    for (let i = 0; i < totalSets; i++) {
      postPromises.push(
        authFetcher(SETTING, {
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
    mutate(getSettings(newSet.id), Promise.all(postPromises), {
      populateCache: (newSettings: Setting[], cachedSettings) => ({
        ...cachedSettings,
        count: newSettings.length,
        results: newSettings,
      }),
    });

    setExercise(null);
  };

  return (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
      component="form"
      onSubmit={handleSubmit}
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
        slotProps={{
          htmlInput: { min: 1 },
        }}
        value={numSets}
        onChange={(event) => setNumSets(event.target.value)}
        sx={{ minWidth: 50, maxWidth: 75 }}
      />
      <IconButton type="submit">
        <Add />
      </IconButton>
    </Box>
  );
};
