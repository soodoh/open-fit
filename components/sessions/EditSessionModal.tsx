import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  // ListItem,
  // ListItemText,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers";
import moment, { type Moment } from "moment";
import { SessionWithSets } from "@/types/workoutSession";

export const EditSessionModal = ({
  session,
  open,
  onClose,
}: {
  open: boolean;
  session?: SessionWithSets;
  onClose: () => void;
}) => {
  const [notes, setNotes] = useState<string>(session?.notes ?? "");
  const [impression, setImpression] = useState<number | null>(
    session?.impression ?? null,
  );
  const [startTime, setStartTime] = useState<Moment | null>(
    session?.startTime ? moment(session.startTime) : moment(),
  );
  const [endTime, setEndTime] = useState<Moment | null>(
    session?.endTime ? moment(session.endTime) : null,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        action: async () => {
          // Must be null or valid date
          const isStartValid = startTime === null || startTime.isValid();
          const isEndValid = endTime === null || endTime.isValid();
          // Prevent negative durations (if both are valid dates)
          const isDurationValid =
            !startTime || !endTime || startTime.isSameOrBefore(endTime);
          if (!isStartValid || !isEndValid || !isDurationValid) {
            return;
          }
          onClose();
        },
      }}
    >
      <DialogTitle>
        {session ? "Edit Workout Session" : "Create Workout Session"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Autocomplete
          sx={{ mt: 2 }}
          fullWidth
          options={[]}
          autoHighlight
          // value={workoutValue}
          // isOptionEqualToValue={(option, value) => option?.id === value?.id}
          // onChange={(_, newValue) => {
          //   if (newValue?.id) {
          //     setWorkout(newValue.id);
          //   }
          // }}
          noOptionsText="No workouts found"
          // getOptionKey={(option) => `workout-opt-${option?.id}`}
          // getOptionLabel={(option) => option?.name || "Loading"}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a routine as a template for this session"
              placeholder="Choose a routine"
            />
          )}
          // renderOption={({ key, ...optionProps }, option) => {
          //   return (
          //     <ListItem key={key} {...optionProps}>
          //       <ListItemText primary={option?.name} />
          //     </ListItem>
          //   );
          // }}
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
          onChange={(event) => setNotes(event.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
