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
import type { RoutineDay } from "@prisma/client";

export const RoutineDayItem = ({ routineDay }: { routineDay: RoutineDay }) => {
  return (
    <>
      <ListItem
        dense
        disablePadding
        secondaryAction={<EditDayMenu routineDay={routineDay} />}
      >
        <ListItemButton component={Link} href={`/day/${routineDay.id}`}>
          <ListItemText
            primary={routineDay.description}
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
                {routineDay.days.map((weekday) => (
                  <Chip
                    key={`${routineDay.id}-${weekday}`}
                    component="span"
                    label={moment().day(weekday).format("ddd")}
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
