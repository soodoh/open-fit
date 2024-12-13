import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemText,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import {
  Impression,
  type WorkoutSession,
} from "@/types/privateApi/workoutSession";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import moment, { type Moment } from "moment";
import { PaginatedResponse } from "@/types/response";
import { Workout } from "@/types/privateApi/workout";

export const EditSessionModal = ({
  open,
  sessionId,
  onClose,
}: {
  open: boolean;
  sessionId: number;
  onClose: () => void;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: session, mutate } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );
  const { data: workouts } =
    useAuthedSWR<PaginatedResponse<Workout>>("/workout");
  const workoutOptions = workouts?.results ?? [];

  const [workoutId, setWorkout] = useState<number | null>(null);
  const workoutValue =
    workoutOptions.find((workout) => workout.id === workoutId) ?? null;
  const [date, setDate] = useState<Moment>(moment());
  const [notes, setNotes] = useState<string | null>(null);
  const [impression, setImpression] = useState<Impression>(Impression.NEUTRAL);
  const [startTime, setStartTime] = useState<Moment | null>(null);
  const [endTime, setEndTime] = useState<Moment | null>(null);

  useEffect(() => {
    setWorkout(session?.workout ?? null);
    setDate(moment(session?.date));
    setNotes(session?.notes ?? null);
    setImpression(
      session?.impression
        ? parseInt(session.impression, 10)
        : Impression.NEUTRAL,
    );
    const startTimeString =
      session?.date && session?.time_start
        ? `${session.date}T${session.time_start}`
        : null;
    const endTimeString =
      session?.date && session?.time_end
        ? `${session.date}T${session.time_end}`
        : null;
    setStartTime(startTimeString ? moment(startTimeString) : null);
    setEndTime(endTimeString ? moment(endTimeString) : null);
  }, [session]);

  if (!session) {
    return null;
  }
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
          // Must be null or valid date
          const isStartValid = startTime === null || startTime.isValid();
          const isEndValid = endTime === null || endTime.isValid();
          // Prevent negative durations (if both are valid dates)
          const isDurationValid =
            !startTime || !endTime || startTime.isSameOrBefore(endTime);
          if (!isStartValid || !isEndValid || !isDurationValid) {
            return;
          }

          const data = await authFetcher(`/workoutsession/${sessionId}`, {
            method: "PUT",
            body: JSON.stringify({
              workout: workoutId,
              date: date.format("YYYY-MM-DD"),
              notes,
              impression: impression.toString(),
              time_start: startTime ? startTime.format("HH:mm:ss") : null,
              time_end: endTime ? endTime.format("HH:mm:ss") : null,
            }),
          });
          mutate(data);
          onClose();
        },
      }}
    >
      <DialogTitle>Edit Workout Session</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Autocomplete
          sx={{ mt: 2 }}
          fullWidth
          options={workoutOptions}
          autoHighlight
          value={workoutValue}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          onChange={(_, newValue) => {
            if (newValue) {
              setWorkout(newValue.id);
            }
          }}
          noOptionsText="No workouts found"
          getOptionKey={(option) => `workout-opt-${option.id}`}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Workout Routine"
              placeholder="Choose a routine"
            />
          )}
          renderOption={({ key, ...optionProps }, option) => {
            return (
              <ListItem key={key} {...optionProps}>
                <ListItemText primary={option.name} />
              </ListItem>
            );
          }}
        />

        <DatePicker
          label="Date"
          value={date}
          defaultValue={moment()}
          onChange={(newDate) => {
            if (newDate) {
              setDate(newDate);
            }
          }}
        />
        <TimePicker
          label="Start Time"
          value={startTime}
          maxTime={endTime ?? undefined}
          onChange={(newTime) => {
            setStartTime(newTime);
          }}
        />
        <TimePicker
          label="End Time"
          value={endTime}
          minTime={startTime ?? undefined}
          onChange={(newTime) => {
            setEndTime(newTime);
          }}
        />

        <Box>
          <Typography component="legend">General Impression</Typography>
          <Rating
            size="medium"
            max={3}
            value={impression}
            onChange={(_, newValue) => {
              if (newValue) {
                setImpression(newValue);
              }
            }}
          />
        </Box>

        <TextField
          multiline
          rows={4}
          label="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value || null)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
