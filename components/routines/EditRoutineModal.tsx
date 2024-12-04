import useSWR from "swr";
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
import { PaginatedResponse } from "@/types/response";
import { useAuthFetcher } from "@/lib/fetcher";
import styles from "@/styles/routinePage.module.css";

export const EditRoutineModal = ({
  open,
  routine,
  onClose,
}: {
  open: boolean;
  routine: Workout | null;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workouts, mutate } = useSWR<PaginatedResponse<Workout>>(
    "/workout",
    authFetcher,
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(routine?.name ?? "");
    setDescription(routine?.description ?? "");
  }, [routine]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = await authFetcher(
            routine?.id ? `/workout/${routine.id}` : "/workout/",
            {
              method: routine?.id ? "PUT" : "POST",
              body: JSON.stringify({
                name,
                description,
              }),
            },
          );
          onClose();
          if (!workouts) {
            return;
          }

          const optimisticUpdate = {
            ...workouts,
            results: [...workouts.results],
          };
          if (!routine?.id) {
            optimisticUpdate.count += 1;
            optimisticUpdate.results.unshift(data);
          } else {
            const index = optimisticUpdate.results.findIndex(
              (workout) => workout.id === routine?.id,
            );
            if (index > -1) {
              optimisticUpdate.results[index] = data;
            }
          }
          mutate(optimisticUpdate);
        },
      }}
    >
      <DialogTitle>{routine ? "Edit Routine" : "New Routine"}</DialogTitle>
      <DialogContent className={styles.editRoutine}>
        <TextField
          autoFocus
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
