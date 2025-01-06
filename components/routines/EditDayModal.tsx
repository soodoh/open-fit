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
import { useState } from "react";
import moment from "moment";
import { type RoutineDay, Weekday } from "@prisma/client";

export const EditDayModal = ({
  open,
  onClose,
  routineDay,
}: {
  open: boolean;
  onClose: () => void;
  routineDay?: RoutineDay;
}) => {
  const [selectedWeekdays, setWeekdays] = useState<Weekday[]>([]);

  const handleWeekdayChange = (event: SelectChangeEvent<Weekday[]>) => {
    const newWeekdays = event.target.value as Weekday[];
    setWeekdays(
      newWeekdays.sort((a, b) =>
        moment(a, "dddd").isBefore(moment(b, "dddd")) ? -1 : 1,
      ),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: "form",
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
          id="workoutDay-description"
          variant="filled"
          label="Description"
          name="description"
          defaultValue={routineDay?.description}
        />
        <FormControl fullWidth>
          <InputLabel id={`${routineDay?.id ?? "new"}-weekday-label`}>
            Weekdays
          </InputLabel>
          <Select
            labelId={`${routineDay?.id ?? "new"}-weekday-label`}
            id={`${routineDay?.id ?? "new"}-weekday`}
            multiple
            name="weekdays"
            onChange={handleWeekdayChange}
            value={selectedWeekdays}
            input={<OutlinedInput label="Weekdays" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={`weekday-${value}`}
                    label={moment(value, "dddd").format("dddd")}
                  />
                ))}
              </Box>
            )}
          >
            {Object.values(Weekday).map((weekday) => (
              <MenuItem
                key={`${routineDay?.id ?? "new"}-${weekday}`}
                value={weekday}
              >
                {moment(weekday, "dddd").format("dddd")}
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
