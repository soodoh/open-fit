import { useSWRConfig } from "swr";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { ExerciseSearchData } from "@/types/privateApi/exerciseSearch";
import { Box, IconButton, TextField } from "@mui/material";
import { AutocompleteExercise } from "../exercises/AutocompleteExercise";
import { type FormEvent, useState } from "react";
import { Add } from "@mui/icons-material";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { getSession, getWorkoutLogs, WORKOUT_LOG } from "@/lib/urls";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { WorkoutLog } from "@/types/privateApi/workoutLog";
import { PaginatedResponse } from "@/types/response";

export const AddLogRow = ({ sessionId }: { sessionId: number }) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();

  const { data: session } = useAuthedSWR<WorkoutSession>(getSession(sessionId));
  const [exercise, setExercise] = useState<ExerciseSearchData | null>(null);
  const [numSets, setNumSets] = useState<string>("1");
  const defaultWeightUnit = useDefaultWeightUnit();

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (!exercise || !session?.date) {
      return;
    }

    const totalSets = parseInt(numSets, 10) || 1;
    // Add settings based on numSets
    const logPromises: Promise<WorkoutLog>[] = [];
    for (let i = 0; i < totalSets; i++) {
      logPromises.push(
        authFetcher(WORKOUT_LOG, {
          method: "POST",
          body: JSON.stringify({
            reps: 0,
            weight: 0,
            order: 0,
            date: session.date,
            exercise_base: exercise.base_id,
            workout: session.workout,
            weight_unit: defaultWeightUnit,
          }),
        }) as Promise<WorkoutLog>,
      );
    }
    mutate(getWorkoutLogs(session.date), Promise.all(logPromises), {
      populateCache: (
        newLogs: WorkoutLog[],
        cachedLogs?: PaginatedResponse<WorkoutLog>,
      ) => {
        const newResults = cachedLogs?.results
          ? [...cachedLogs.results, ...newLogs]
          : newLogs;
        return { ...cachedLogs, count: newResults.length, results: newResults };
      },
      revalidate: false,
      rollbackOnError: true,
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
