"use client";
import moment from "moment";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import { Typography, Card, CardHeader, List, Divider } from "@mui/material";
import useSWR from "swr";
import { EditRoutineMenu } from "./EditRoutineMenu";
import { RoutineDayItem } from "./RoutineDayItem";

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
        action={<EditRoutineMenu workoutId={workoutId} />}
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
            <RoutineDayItem
              key={`workout-${workoutId}-day-${workoutDay.id}`}
              workoutId={workoutId}
              dayId={workoutDay.id}
            />
          );
        })}
      </List>
    </Card>
  );
};
