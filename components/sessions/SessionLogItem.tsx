import { useAuthedSWR, useAuthFetcher } from "@/lib/fetcher";
import type { PaginatedResponse } from "@/types/response";
import {
  Avatar,
  Collapse,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Add,
  Error,
  ExpandLess,
  ExpandMore,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useDefaultWeightUnit } from "@/lib/useDefaultWeightUnit";
import { useExercise } from "@/lib/useExercise";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { WorkoutLog } from "@/types/privateApi/workoutLog";
import { EditLogRow } from "./EditLogRow";

export const SessionLogItem = ({
  sessionId,
  exerciseBaseId,
}: {
  sessionId: number;
  exerciseBaseId: number;
}) => {
  const authFetcher = useAuthFetcher();

  const { data: session } = useAuthedSWR<WorkoutSession>(
    `/workoutsession/${sessionId}`,
  );
  const { data: workoutLogs, mutate: mutateLogs } = useAuthedSWR<
    PaginatedResponse<WorkoutLog>
  >(
    session?.date
      ? `/workoutlog?ordering=id&date=${session.date}&exercise_base=${exerciseBaseId}`
      : null,
  );

  const logs = workoutLogs?.results ?? [];
  const { exercise, imageUrl } = useExercise(exerciseBaseId);

  const [open, setOpen] = useState(false);
  const defaultWeightUnit = useDefaultWeightUnit();

  const handleAdd = async () => {
    const newLog = await authFetcher("/workoutlog/", {
      method: "POST",
      body: JSON.stringify({
        workout: session?.workout,
        exercise_base: exerciseBaseId,
        weight_unit: defaultWeightUnit,
        reps: 0,
        weight: 0,
        date: session?.date,
      }),
    });
    const newLogItems = logs ? [...logs, newLog] : [newLog];
    mutateLogs({
      ...workoutLogs,
      count: newLogItems.length,
      results: newLogItems,
    });
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemAvatar>
            {exercise && imageUrl ? (
              <Avatar alt={`${exercise.name} set item`} src={imageUrl} />
            ) : (
              <Avatar>{exercise ? <ImageIcon /> : <Error />}</Avatar>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={exercise?.name ?? "Unknown exercise"}
            secondary={`${logs.length} sets`}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {logs.map((log) => (
            <EditLogRow
              key={`log-${log.id}`}
              sessionId={sessionId}
              logId={log.id}
            />
          ))}

          <ListItem sx={{ display: "flex", gap: 2 }}>
            <Fab size="medium" variant="extended" onClick={handleAdd}>
              <Add />
              New set
            </Fab>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
};
