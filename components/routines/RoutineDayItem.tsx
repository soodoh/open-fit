import { useAuthedSWR } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import {
  Box,
  Chip,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { EditDayMenu } from "./EditDayMenu";
import moment from "moment";
import Link from "next/link";

export const RoutineDayItem = ({
  workoutId,
  dayId,
}: {
  workoutId: number;
  dayId: number;
}) => {
  const { data: workoutDay } = useAuthedSWR<Day>(`/day/${dayId}`);

  if (!workoutDay) {
    return null;
  }
  return (
    <>
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <EditDayMenu dayId={workoutDay.id} workoutId={workoutId} />
        }
      >
        <ListItemButton
          component={Link}
          href={`/routines/${workoutId}/${dayId}`}
        >
          <ListItemText
            primary={workoutDay.description}
            secondary={
              <Box
                component="span"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                {workoutDay.day.map((weekday) => (
                  <Chip
                    key={`workout-${workoutId}-weekday-${weekday}`}
                    component="span"
                    label={moment().set("weekday", weekday).format("ddd")}
                  />
                ))}
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};
