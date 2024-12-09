import useSWR from "swr";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "@/types/response";
import { fetcher, useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { DaysOfWeek } from "@/types/publicApi/daysOfWeek";
import { Weekday } from "./Weekday";

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
  const { data: daysOfWeek } = useSWR<PaginatedResponse<DaysOfWeek>>(
    `/daysofweek/`,
    fetcher,
  );

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

  const handleWeekdayChange = (event: SelectChangeEvent<number[]>) => {
    const set = new Set(event.target.value as number[]);
    setWeekdays(Array.from(set).sort((a, b) => a - b));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
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
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          sx={{ mb: 1 }}
          margin="normal"
          id="workoutDay-description"
          variant="filled"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id={`${workoutId}-${dayId}-weekday-label`}>
            Weekdays
          </InputLabel>
          <Select
            labelId={`${workoutId}-${dayId}-weekday-label`}
            id={`${workoutId}-${dayId}-weekday`}
            multiple
            value={weekdays}
            onChange={handleWeekdayChange}
            input={<OutlinedInput label="Weekdays" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Weekday key={`weekday-${value}`} weekday={value} />
                ))}
              </Box>
            )}
          >
            {daysOfWeek?.results.map((dayOfWeek, index) => (
              <MenuItem
                key={`${workoutId}-${dayId}-${dayOfWeek.day_of_week}`}
                value={index + 1}
              >
                {dayOfWeek.day_of_week}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
