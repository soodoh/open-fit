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
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment, { type Moment } from "moment";
import { SessionWithSets } from "@/types/workoutSession";
import useSWR from "swr";
import {
  RoutineDayWithRoutine,
  searchTemplates,
} from "@/actions/searchTemplates";
import { createSession } from "@/actions/createSession";
import { editSession } from "@/actions/editSession";

export const EditSessionModal = ({
  session,
  open,
  onClose,
}: {
  open: boolean;
  session?: SessionWithSets;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>(session?.name ?? "");
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
  const [workoutTemplate, setWorkoutTemplate] =
    useState<RoutineDayWithRoutine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: options, isLoading } = useSWR(searchTerm, searchTemplates, {
    keepPreviousData: true,
  });

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
          const sessionData = {
            name,
            startTime: startTime?.toDate(),
            endTime: endTime?.toDate(),
            notes,
            impression,
          };
          if (!session) {
            createSession(sessionData, workoutTemplate?.id);
          } else {
            editSession(session.id, sessionData);
          }
          onClose();
        },
      }}
    >
      <DialogTitle>
        {session ? "Edit Workout Session" : "Create Workout Session"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {!session && (
            <Autocomplete
              sx={{ mt: 2 }}
              fullWidth
              value={workoutTemplate ?? null}
              inputValue={searchTerm}
              options={options ?? []}
              autoHighlight
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              getOptionLabel={(option) => option?.description ?? "Unknown"}
              getOptionKey={(option) => `template-${option?.id}`}
              filterOptions={(option) => option}
              loading={isLoading}
              noOptionsText="No workouts found"
              onChange={(_, selectedTemplate) => {
                setWorkoutTemplate(selectedTemplate);
                setName(selectedTemplate?.description ?? "");
              }}
              onInputChange={(_, newInputValue: string) => {
                setSearchTerm(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Start from template"
                  placeholder="Empty workout"
                />
              )}
              renderOption={({ key, ...optionProps }, option) => {
                return (
                  <ListItem key={key} {...optionProps}>
                    <ListItemText
                      primary={option?.description}
                      secondary={option?.routine?.name}
                    />
                  </ListItem>
                );
              }}
            />
          )}

          <TextField
            variant="outlined"
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <DateTimePicker
            label="Start Time"
            value={startTime}
            maxTime={endTime ?? undefined}
            onChange={(newTime) => {
              setStartTime(newTime);
            }}
          />
          <DateTimePicker
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
              max={5}
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
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
