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
  return (
    <Card>
      <CardHeader title={workout.name} subheader={workout.description} />
      <CardContent>
        {workoutDay?.results.map((workoutDay) => (
          <WorkoutDay
            key={`routine-${workout.id}-day-${workoutDay.id}`}
            day={workoutDay}
          />
        ))}
      </CardContent>
    </Card>
  );
};
