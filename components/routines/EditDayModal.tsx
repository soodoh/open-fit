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
import dayjs from "dayjs";
import { useState } from "react";
import type { RoutineDay } from "@/prisma/generated/client";

export const EditDayModal = ({
  open,
  onClose,
  routineId,
  routineDay,
}: {
  open: boolean;
  onClose: () => void;
  routineId: number;
  routineDay?: RoutineDay;
}) => {
  const [selectedWeekdays, setWeekdays] = useState<number[]>(
    routineDay?.weekdays ?? [],
  );
  const [description, setDescription] = useState(routineDay?.description ?? "");

  const handleWeekdayChange = (event: SelectChangeEvent<number[]>) => {
    const newWeekdays = event.target.value as number[];
    setWeekdays(newWeekdays.sort((a, b) => a - b));
  };

  const onSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    await fetch(routineDay ? `/api/day/${routineDay.id}` : "/api/day", {
      method: "POST",
      body: JSON.stringify({
        routineId,
        description,
        weekdays: selectedWeekdays,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    onClose();
    setWeekdays([]);
    setDescription("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit,
      }}
    >
      <DialogTitle>
        {routineDay ? "Edit Workout Day" : "New Workout Day"}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          sx={{ mb: 1 }}
          margin="normal"
          id="workoutDay-name"
          variant="filled"
          label="Description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <FormControl fullWidth>
          <InputLabel id={`${routineDay?.id ?? "new"}-weekday-label`}>
            Weekdays
          </InputLabel>
          <Select
            labelId={`${routineDay?.id ?? "new"}-weekday-label`}
            id={`${routineDay?.id ?? "new"}-weekday`}
            multiple
            onChange={handleWeekdayChange}
            value={selectedWeekdays}
            required
            input={<OutlinedInput label="Weekdays" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={`weekday-${value}`}
                    label={dayjs().day(value).format("dddd")}
                  />
                ))}
              </Box>
            )}
          >
            {Array.from({ length: 7 }, (_, i) => i + 1).map((weekday) => (
              <MenuItem
                key={`${routineDay?.id ?? "new"}-${weekday}`}
                value={weekday}
              >
                {dayjs().day(weekday).format("dddd")}
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
