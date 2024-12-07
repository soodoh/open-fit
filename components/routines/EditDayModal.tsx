import useSWR from "swr";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PaginatedResponse } from "@/types/response";
import { fetcher, useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { DaysOfWeek } from "@/types/publicApi/daysOfWeek";

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
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          id="workoutDay-description"
          variant="filled"
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <List disablePadding dense>
          {daysOfWeek?.results.map(({ day_of_week: dayOfWeek }, index) => {
            const dayNum = index + 1;
            const checked = weekdays.includes(dayNum);
            const labelId = `weekday-check-${dayOfWeek}`;
            const handleChange = () => {
              if (weekdays.includes(dayNum)) {
                setWeekdays(weekdays.filter((day) => day !== dayNum));
              } else {
                setWeekdays([...weekdays, dayNum]);
              }
            };

            return (
              <ListItem key={`edit-day-week-${dayOfWeek}`} disablePadding>
                <ListItemButton role={undefined} onClick={handleChange} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked}
                      onChange={handleChange}
                      size="small"
                      disableRipple
                      tabIndex={-1}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={dayOfWeek} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};
