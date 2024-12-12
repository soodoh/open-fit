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
import { Day } from "@/types/privateApi/day";

export const DeleteDayModal = ({
  open,
  onClose,
  workoutId,
  dayId,
}: {
  open: boolean;
  onClose: () => void;
  workoutId: number;
  dayId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workoutDays, mutate } = useAuthedSWR<PaginatedResponse<Day>>(
    `/day?training=${workoutId}`,
  );

  const deleteDay = async () => {
    await authFetcher(`/day/${dayId}/`, {
      method: "DELETE",
    });
    const newDays =
      workoutDays?.results?.filter((workoutDay) => workoutDay.id === dayId) ??
      [];
    const optimisticUpdate = {
      ...workoutDays,
      count: newDays.length,
      results: newDays,
    };
    mutate(optimisticUpdate);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-day-title"
      aria-describedby="delete-day-description"
    >
      <DialogTitle id="delete-day-title">Delete Workout Day</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-day-description">
          Are you sure you want to delete this day?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            deleteDay();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
