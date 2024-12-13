import useSWR, { useSWRConfig } from "swr";
import {
  Box,
  Button,
  Chip,
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
import { fetcher, useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { DaysOfWeek } from "@/types/publicApi/daysOfWeek";
import moment from "moment";
import { DAY, DAYS_OF_WEEK, getDay, getDays } from "@/lib/urls";

export const EditDayModal = ({
  open,
  dayId,
  workoutId,
  onClose,
}: {
  open: boolean;
  dayId?: number;
  workoutId?: number;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { mutate } = useSWRConfig();
  const { data: workoutDay, mutate: mutateDay } = useAuthedSWR<Day>(
    getDay(dayId),
  );
  const { data: daysOfWeek } = useSWR<PaginatedResponse<DaysOfWeek>>(
    DAYS_OF_WEEK,
    fetcher,
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
          const dayPromise = authFetcher(dayId ? getDay(dayId) : DAY, {
            method: dayId ? "PATCH" : "POST",
            body: JSON.stringify({
              training: workoutId,
              description,
              day: weekdays,
            }),
          });
          onClose();

          if (!dayId) {
            mutate(getDays(workoutId), dayPromise, {
              populateCache: (newDay: Day, cachedDays) => {
                const newResults = cachedDays?.results
                  ? [...cachedDays.results, newDay]
                  : [newDay];
                return {
                  ...cachedDays,
                  count: newResults.length,
                  results: newResults,
                };
              },
              revalidate: false,
              rollbackOnError: true,
            });
          } else {
            mutateDay(dayPromise, {
              optimisticData: (cachedDay) => ({
                ...cachedDay,
                training: workoutId,
                description,
                day: weekdays,
              }),
              revalidate: true,
              rollbackOnError: true,
            });
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
                  <Chip
                    key={`weekday-${value}`}
                    label={moment().set("weekday", value).format("dddd")}
                  />
                ))}
              </Box>
            )}
          >
            {daysOfWeek?.results?.map((dayOfWeek, index) => (
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
