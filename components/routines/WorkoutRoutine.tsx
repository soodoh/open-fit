import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import { Card, CardHeader, CardContent } from "@mui/material";
import useSWR from "swr";
import { WorkoutDay } from "./WorkoutDay";

export const WorkoutRoutine = ({ workout }: { workout: Workout }) => {
  const { data: workoutDay } = useSWR<PaginatedResponse<Day>>(
    `/day?training=${workout.id}`,
    useAuthFetcher(),
  );
  const namespace = `workout-${workout.id}`;

  return (
    <Card>
      <CardHeader title={workout.name} subheader={workout.description} />
      <CardContent>
        {workoutDay?.results.map((workoutDay) => {
          const dayNamespace = `${namespace}-day-${workoutDay.id}`;
          return (
            <WorkoutDay
              key={dayNamespace}
              namespace={dayNamespace}
              day={workoutDay}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
