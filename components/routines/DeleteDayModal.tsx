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
  dayId,
}: {
  open: boolean;
  onClose: () => void;
  dayId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workoutDay } = useAuthedSWR<Day>(
    typeof dayId === "number" ? `/day/${dayId}` : null,
  );
  const { data: workoutDays, mutate: mutateDays } = useAuthedSWR<
    PaginatedResponse<Day>
  >(workoutDay?.training ? `/day?training=${workoutDay.training}` : null);

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
    mutateDays(optimisticUpdate);
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
