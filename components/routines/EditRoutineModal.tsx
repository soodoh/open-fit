import { Workout } from "@/types/privateApi/workout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { useSWRConfig } from "swr";
import { getWorkout, WORKOUTS } from "@/lib/urls";

export const EditRoutineModal = ({
  open,
  workoutId,
  onClose,
}: {
  open: boolean;
  workoutId?: number;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();
  const { data: workout, mutate: mutateWorkout } = useAuthedSWR<Workout>(
    getWorkout(workoutId),
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updateWorkout: Promise<Workout> = authFetcher(
      workoutId ? getWorkout(workoutId) : WORKOUTS,
      {
        method: workoutId ? "PUT" : "POST",
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
    onClose();
    // Handle optimistic updates
    if (!workoutId) {
      mutate(WORKOUTS, updateWorkout, {
        populateCache: (newWorkout: Workout, cachedWorkouts) => {
          const newResults = cachedWorkouts?.results
            ? [newWorkout, ...cachedWorkouts.results]
            : [newWorkout];
          return {
            ...cachedWorkouts,
            count: newResults.length,
            results: newResults,
          };
        },
        revalidate: false,
        rollbackOnError: true,
      });
    } else {
      mutateWorkout(updateWorkout, {
        optimisticData: (cachedWorkout) => ({
          ...cachedWorkout,
          name,
          description,
        }),
        revalidate: true,
        rollbackOnError: true,
      });
    }
  };

  useEffect(() => {
    setName(workout?.name ?? "");
    setDescription(workout?.description ?? "");
  }, [workout]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{workoutId ? "Edit Routine" : "New Routine"}</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="routine-name"
          variant="filled"
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          variant="filled"
          multiline
          rows={4}
          label="Description"
          value={description}
          placeholder="Routine description"
          onChange={(event) => setDescription(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
