import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import useSWR from "swr";
import type { PaginatedResponse } from "@/types/response";
import type { WorkoutSetType } from "@/types/privateApi/set";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  List,
  Typography,
} from "@mui/material";
import { WorkoutSet as WorkoutSet } from "./WorkoutSet";
import { ExpandMore } from "@mui/icons-material";
import { EditDayActions } from "./EditDayActions";
import moment from "moment";

export const WorkoutDay = ({
  dayId,
  workoutId,
}: {
  dayId: number;
  workoutId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: day } = useSWR<Day>(`/day/${dayId}`, authFetcher);
  const { data: workoutSet } = useSWR<PaginatedResponse<WorkoutSetType>>(
    `/set?exerciseday=${dayId}`,
    authFetcher,
  );

  if (!day) {
    return null;
  }
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`day-${dayId}-content`}
        id={`day-${dayId}-header`}
      >
        <div>
          <Typography variant="subtitle1">{day.description}</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {day.day.map((weekday) => (
              <Chip
                key={`day-${dayId}-weekday-${weekday}`}
                label={moment().set("weekday", weekday).format("dddd")}
              />
            ))}
          </Box>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <EditDayActions workoutId={workoutId} dayId={dayId} />
      </AccordionDetails>
      <Divider />

      <List dense disablePadding>
        {workoutSet?.results.map((set) => {
          return (
            <WorkoutSet key={`set-${set.id}`} dayId={dayId} setId={set.id} />
          );
        })}
      </List>
    </Accordion>
  );
};
