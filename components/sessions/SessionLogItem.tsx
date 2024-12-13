import { useExercise } from "@/lib/useExercise";
import { ListItem, ListItemText } from "@mui/material";

export const SessionLogItem = ({
  exerciseBaseId,
}: {
  exerciseBaseId: number;
}) => {
  const exercise = useExercise(exerciseBaseId);
  console.log(exercise);
  // const { data: workoutLogs } = useAuthedSWR<PaginatedResponse<WorkoutLog>>(
  //   session?.date ? `/workoutlog?ordering=id&date=${session.date}` : null,
  // );

  return (
    <ListItem>
      <ListItemText primary={exercise?.name} />
    </ListItem>
  );
};
