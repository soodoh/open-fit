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
import { getDay, getDays } from "@/lib/urls";
import { useSWRConfig } from "swr";

export const DeleteDayModal = ({
  open,
  onClose,
  dayId,
}: {
  open: boolean;
  onClose: () => void;
  dayId?: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();
  const { data: workoutDay } = useAuthedSWR<Day>(getDay(dayId));

  const deleteDay = async () => {
    const deletePromise = authFetcher(getDay(dayId), {
      method: "DELETE",
    });
    mutate(getDays(workoutDay?.training), deletePromise, {
      populateCache: (_, cachedDays) => {
        const newResults =
          cachedDays?.results?.filter((day: Day) => day.id !== dayId) ?? [];
        return {
          ...cachedDays,
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
