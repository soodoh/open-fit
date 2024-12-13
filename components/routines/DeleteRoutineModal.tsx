import { Workout } from "@/types/privateApi/workout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuthFetcher } from "@/lib/fetcher";
import { getWorkout, WORKOUTS } from "@/lib/urls";
import { useSWRConfig } from "swr";

export const DeleteRoutineModal = ({
  open,
  onClose,
  workoutId,
}: {
  open: boolean;
  onClose: () => void;
  workoutId?: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();
  const deleteRoutine = async () => {
    const deletePromise = authFetcher(getWorkout(workoutId), {
      method: "DELETE",
    });
    mutate(WORKOUTS, deletePromise, {
      populateCache: (_, cachedWorkouts) => {
        const newResults =
          cachedWorkouts?.results?.filter(
            (workout: Workout) => workout.id !== workoutId,
          ) ?? [];
        return {
          ...cachedWorkouts,
          count: newResults.length,
          results: newResults,
        };
      },
      revalidate: false,
      rollbackOnError: true,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-routine-title"
      aria-describedby="delete-routine-description"
    >
      <DialogTitle id="delete-routine-title">Delete Workout</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-routine-description">
          Are you sure you want to delete this workout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            deleteRoutine();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
