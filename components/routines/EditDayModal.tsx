import useSWR from "swr";
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
import { Day } from "@/types/privateApi/day";

export const EditDayModal = ({
  open,
  workoutId,
  dayId,
  onClose,
}: {
  open: boolean;
  workoutId: number;
  dayId: number | null;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workoutDays, mutate: mutateResults } = useSWR<
    PaginatedResponse<Day>
  >(`/day?training=${workoutId}`, authFetcher);
  const { data: workoutDay, mutate } = useSWR<Day>(
    Number.isInteger(dayId) ? `/day/${dayId}` : null,
    authFetcher,
  );
  const [description, setDescription] = useState("");
  const [weekdays, setWeekdays] = useState<number[]>([]);

  useEffect(() => {
    setDescription(workoutDay?.description ?? "");
    setWeekdays(workoutDay?.day ?? []);
  }, [workoutDay]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const data = await authFetcher(dayId ? `/day/${dayId}` : "/day/", {
            method: dayId ? "PUT" : "POST",
            body: JSON.stringify({
              training: workoutId,
              description,
              day: weekdays,
            }),
          });
          onClose();
          if (!workoutDays) {
            return;
          }

          if (!dayId) {
            mutateResults({
              ...workoutDays,
              count: workoutDays.count + 1,
              results: [...workoutDays.results, data],
            });
          } else {
            mutate(data);
          }
        },
      }}
    >
      <DialogTitle>
        {workoutId ? "Edit Workout Day" : "New Workout Day"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="workoutDay-description"
          variant="filled"
          label="Description"
          value={description}
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
