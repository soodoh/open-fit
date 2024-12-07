import moment from "moment";
import { useAuthFetcher } from "@/lib/fetcher";
import { Day } from "@/types/privateApi/day";
import { Workout } from "@/types/privateApi/workout";
import { PaginatedResponse } from "@/types/response";
import { Typography, Card, CardContent, CardHeader } from "@mui/material";
import useSWR from "swr";
import { WorkoutDay } from "./WorkoutDay";
import { EditRoutineActions } from "./EditRoutineActions";

export const WorkoutRoutine = ({ workoutId }: { workoutId: number }) => {
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
    <Card>
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
      <CardContent>
        {workoutDays?.results.map((workoutDay) => {
          return (
            <WorkoutDay
              key={`day-${workoutDay.id}`}
              workoutId={workoutId}
              dayId={workoutDay.id}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
