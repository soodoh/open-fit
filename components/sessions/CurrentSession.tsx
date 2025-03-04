"use client";

import { Typography, Grid2 as Grid, Container } from "@mui/material";
import type { SessionWithRelations } from "@/types/workoutSession";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";
import { CurrentDuration } from "./CurrentDuration";
import { ListView } from "@/types/constants";

export const CurrentSession = ({
  session,
  units,
}: {
  session: SessionWithRelations;
  units: Units;
}) => {
  return (
    <>
      <Container maxWidth="lg">
        <Grid sx={{ my: 2 }} container spacing={2}>
          <CurrentDuration startTime={session.startTime} />

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
          view={ListView.CurrentSession}
          sessionOrDayId={session.id}
          setGroups={session.setGroups}
          units={units}
        />
      </Container>
    </>
  );
};
