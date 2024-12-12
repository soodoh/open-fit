import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";

export const DeleteRoutineModal = ({
  open,
  onClose,
  workoutId,
}: {
  open: boolean;
  onClose: () => void;
  workoutId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workouts, mutate } =
    useAuthedSWR<PaginatedResponse<Workout>>("/workout");
  const deleteRoutine = async () => {
    authFetcher(`/workout/${workoutId}/`, {
      method: "DELETE",
    });
    const newWorkouts =
      workouts?.results?.filter((workout) => workout.id === workoutId) ?? [];
    const optimisticUpdate = {
      ...workouts,
      count: newWorkouts.length,
      results: newWorkouts,
    };
    mutate(optimisticUpdate);
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
