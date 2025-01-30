"use client";

import {
  Rating,
  Typography,
  Grid2 as Grid,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Container,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import type { SessionWithRelations } from "@/types/workoutSession";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";

export const SessionPage = ({
  session,
  units,
}: {
  session: SessionWithRelations;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);

  const durationDate =
    session.startTime && session.endTime
      ? dayjs.duration(dayjs(session.endTime).diff(dayjs(session.startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <>
      <Container maxWidth="xl">
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

      <Divider />
      <WorkoutList
        active
        reorder={isReorderActive}
        setGroups={session.setGroups}
        units={units}
      />
    </>
  );
};
