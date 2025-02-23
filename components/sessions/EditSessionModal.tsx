import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import { SessionWithRelations } from "@/types/workoutSession";
import { RoutineDayWithRoutine } from "@/actions/searchTemplates";
import { createSession } from "@/actions/createSession";
import { editSession } from "@/actions/editSession";
import { SelectTemplate } from "./SelectTemplate";

export const EditSessionModal = ({
  session,
  open,
  onClose,
}: {
  open: boolean;
  session?: SessionWithRelations;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>(session?.name ?? "");
  const [notes, setNotes] = useState<string>(session?.notes ?? "");
  const [impression, setImpression] = useState<number | null>(
    session?.impression ?? null,
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(
    session?.startTime ? dayjs(session.startTime) : dayjs(),
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(
    session?.endTime ? dayjs(session.endTime) : null,
  );
  const [workoutTemplate, setWorkoutTemplate] =
    useState<RoutineDayWithRoutine | null>(session?.template ?? null);

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
            !startTime || !endTime || startTime.isBefore(endTime);
          if (!isStartValid || !isEndValid || !isDurationValid) {
            return;
          }
          const sessionData = {
            templateId: workoutTemplate?.id,
            name,
            startTime: startTime?.toDate(),
            endTime: endTime?.toDate(),
            notes,
            impression,
          };
          if (!session) {
            createSession(sessionData);
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
          <SelectTemplate
            disabled={!!session}
            label={session ? "Created with template" : "Start with template"}
            value={session?.template ?? null}
            onChange={(selectedTemplate) => {
              setWorkoutTemplate(selectedTemplate);
              if (selectedTemplate?.description) {
                setName(selectedTemplate.description);
              }
            }}
          />

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
