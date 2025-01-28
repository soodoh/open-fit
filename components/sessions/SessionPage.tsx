"use client";

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
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { EditSessionMenu } from "./EditSessionMenu";
import type { SessionWithSets } from "@/types/workoutSession";
import { WorkoutSetGroup } from "../workoutSet/WorkoutSetGroup";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";

export const SessionPage = ({
  session,
  units,
}: {
  session: SessionWithSets;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);
  const durationDate =
    session.startTime && session.endTime
      ? moment.duration(moment(session.endTime).diff(moment(session.startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <Card>
      <CardHeader
        title={
          <>
            <Typography variant="h4" gutterBottom>
              {session.name}
            </Typography>
            <Chip
              variant="outlined"
              label={moment(session.startTime).format("MM/DD/YYYY")}
            />
          </>
        }
        action={<EditSessionMenu session={session} />}
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
            <Rating size="large" max={5} value={session.impression} readOnly />
          </Grid>

          {session.notes && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="subtitle1">Notes</Typography>
              <Typography variant="subtitle2">{session.notes}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <Divider />

      <CardContent>
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
      </CardContent>

      <WorkoutList
        reorder={isReorderActive}
        setGroups={session.setGroups}
        units={units}
      />
    </Card>
  );
};
