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
import { getDay } from "@/lib/urls";

export const RoutineDayItem = ({
  workoutId,
  dayId,
}: {
  workoutId?: number;
  dayId?: number;
}) => {
  const { data: workoutDay } = useAuthedSWR<Day>(getDay(dayId));

  if (!workoutDay) {
    return null;
  }
  return (
    <>
      <ListItem
        dense
        disablePadding
        secondaryAction={
          <EditDayMenu workoutId={workoutId} dayId={workoutDay.id} />
        }
      >
        <ListItemButton component={Link} href={`/day/${dayId}`}>
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
                {workoutDay?.day?.map((weekday) => (
                  <Chip
                    key={`day-${dayId}-weekday-${weekday}`}
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
