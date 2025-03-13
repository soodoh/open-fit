"use client";

import {
  Rating,
  Typography,
  Grid2 as Grid,
  Container,
  Box,
  Chip,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import type { SessionWithRelations } from "@/types/workoutSession";
import { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";
import { ListView } from "@/types/constants";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import { EditSessionMenu } from "./EditSessionMenu";

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
        <Box
          sx={{
            my: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            variant="outlined"
            label={dayjs(session.startTime).format("MM/DD/YYYY")}
          />

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            LinkComponent={Link}
            href="/logs"
          >
            Logs
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h4">{session.name}</Typography>
          <EditSessionMenu session={session} />
        </Box>
      </Container>

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
