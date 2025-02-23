"use client";

import { Rating, Typography, Grid2 as Grid, Container } from "@mui/material";
import dayjs from "dayjs";
import type { SessionWithRelations } from "@/types/workoutSession";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";
import { ListView } from "@/types/constants";

export const SessionPage = ({
  session,
  units,
}: {
  session: SessionWithRelations;
  units: Units;
}) => {
  const durationDate =
    session.startTime && session.endTime
      ? dayjs.duration(dayjs(session.endTime).diff(dayjs(session.startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <>
      <Container maxWidth="lg">
        <Grid sx={{ my: 2 }} container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1">Duration</Typography>
            <Typography variant="subtitle2">{durationString}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" component="legend">
              General Impression
            </Typography>
            <Rating size="large" max={5} value={session.impression} readOnly />
          </Grid>

          {session.notes && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="subtitle2">{session.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </Container>

      <Container disableGutters maxWidth="lg">
        <WorkoutList
          view={ListView.EditSession}
          sessionOrDayId={session.id}
          setGroups={session.setGroups}
          units={units}
        />
      </Container>
    </>
  );
};
