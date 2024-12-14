"use client";
import { useAuthedSWR } from "@/lib/fetcher";
import { useSessionDuration } from "@/lib/useSessionDuration";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutLog } from "@/types/privateApi/workoutLog";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { PaginatedResponse } from "@/types/response";
import {
  List,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Rating,
  Typography,
  Grid2 as Grid,
  Divider,
} from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { SessionLogItem } from "./SessionLogItem";
import { EditSessionMenu } from "./EditSessionMenu";
import { getSession, getWorkout, getWorkoutLogs } from "@/lib/urls";

export const SessionPage = ({ sessionId }: { sessionId: number }) => {
  const { data: session } = useAuthedSWR<WorkoutSession>(getSession(sessionId));
  const { data: workout } = useAuthedSWR<Workout>(getWorkout(session?.workout));
  const { data: workoutLogs } = useAuthedSWR<PaginatedResponse<WorkoutLog>>(
    getWorkoutLogs(session?.date),
  );
  const exerciseIds = useMemo(() => {
    const uniqueIds = new Set(
      workoutLogs?.results?.map((log) => log.exercise_base),
    );
    return Array.from(uniqueIds);
  }, [workoutLogs]);

  const durationString = useSessionDuration(sessionId);

  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography variant="h4" gutterBottom>
              {workout?.name || "Unknown Routine"}
            </Typography>
            <Chip
              variant="outlined"
              label={moment(session?.date).format("MM/DD/YYYY")}
            />
          </>
        }
        action={<EditSessionMenu sessionId={sessionId} />}
        disableTypography
      />

      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1">Duration</Typography>
            <Typography variant="subtitle2">{durationString}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" component="legend">
              General Impression
            </Typography>
            <Rating
              size="large"
              max={3}
              value={session?.impression ? parseInt(session.impression) : null}
              readOnly
            />
          </Grid>

          {session?.notes && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="subtitle2">{session.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <Divider />

      <List disablePadding>
        {exerciseIds.map((exerciseBaseId) => (
          <SessionLogItem
            key={`exercise-${exerciseBaseId}`}
            exerciseBaseId={exerciseBaseId}
            sessionId={sessionId}
          />
        ))}
      </List>
    </Card>
  );
};
