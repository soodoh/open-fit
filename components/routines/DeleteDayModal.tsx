import useSWR from "swr";
import { PaginatedResponse } from "@/types/response";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useAuthFetcher } from "@/lib/fetcher";
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
  const { data: workoutDays, mutate } = useSWR<PaginatedResponse<Day>>(
    `/day?training=${workoutId}`,
    authFetcher,
  );

  const deleteDay = async () => {
    authFetcher(`/day/${dayId}/`, {
      method: "DELETE",
    });
    if (!workoutDays) {
      return;
    }
    const optimisticUpdate = {
      ...workoutDays,
      count: workoutDays.count - 1,
      results: workoutDays.results.filter(
        (workoutDay) => workoutDay.id === dayId,
      ),
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
