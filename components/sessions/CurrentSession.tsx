"use client";

import {
  Typography,
  Grid2 as Grid,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Container,
} from "@mui/material";
import { useState } from "react";
import type { SessionWithRelations } from "@/types/workoutSession";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";
import { CurrentDuration } from "./CurrentDuration";
import { RestTimer } from "./RestTimer";
import { ListView } from "@/types/constants";
import { AddExerciseRow } from "../routines/AddExerciseRow";

export const CurrentSession = ({
  session,
  units,
}: {
  session: SessionWithRelations;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);

  return (
    <>
      <Container maxWidth="lg">
        <Grid sx={{ my: 2 }} container spacing={2}>
          <CurrentDuration startTime={session.startTime} />
          <RestTimer />

          {session.notes && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="subtitle2">{session.notes}</Typography>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    value={isReorderActive}
                    onChange={(event) => setReorderActive(event.target.checked)}
                  />
                }
                label="Reorder Sets"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Container>

      <Container disableGutters maxWidth="lg">
        <AddExerciseRow sessionOrDayId={session?.id} type="session" />
        <Divider />
        <WorkoutList
          view={ListView.CurrentSession}
          reorder={isReorderActive}
          setGroups={session.setGroups}
          units={units}
        />
      </Container>
    </>
  );
};
