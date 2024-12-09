"use client";
import moment from "moment";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import {
  Typography,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  CardActions,
  Button,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import useSWR from "swr";
import { EditRoutineActions } from "./EditRoutineActions";
import { EditDayActions } from "./EditDayActions";
import Link from "next/link";

const RoutineDay = ({
  workoutId,
  dayId,
}: {
  workoutId: number;
  dayId: number;
}) => {
  const authFetcher = useAuthFetcher();
  const { data: workoutDay } = useSWR<Day>(`/day/${dayId}`, authFetcher);

  if (!workoutDay) {
    return null;
  }
  return (
    <>
      <ListItem
        secondaryAction={
          <EditDayActions dayId={workoutDay.id} workoutId={workoutId} />
        }
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
      </ListItem>
      <Divider />
    </>
  );
};

export const RoutineCard = ({ workoutId }: { workoutId: number }) => {
  const authFetcher = useAuthFetcher();
  const { data: workout } = useSWR<Workout>(
    `/workout/${workoutId}`,
    authFetcher,
  );
  const { data: workoutDays } = useSWR<PaginatedResponse<Day>>(
    `/day?training=${workoutId}`,
    authFetcher,
  );

  if (!workout) {
    return null;
  }
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader
        action={<EditRoutineActions workoutId={workoutId} />}
        title={workout.name}
        subheader={
          <>
            {workout.description && (
              <Typography variant="subtitle2">{workout.description}</Typography>
            )}
            <Typography variant="caption" gutterBottom>
              {moment(workout.creation_date).format("MM/DD/YYYY")}
            </Typography>
          </>
        }
      />

      <List dense disablePadding sx={{ flexGrow: 1 }}>
        <Divider />
        {workoutDays?.results.map((workoutDay) => {
          return (
            <RoutineDay
              key={`workout-${workoutId}-day-${workoutDay.id}`}
              workoutId={workoutId}
              dayId={workoutDay.id}
            />
          );
        })}
      </List>

      <CardActions>
        <Button component={Link} href={`/routines/${workoutId}`}>
          View Routine
        </Button>
      </CardActions>
    </Card>
  );
};
