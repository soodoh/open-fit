"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { EditDayMenu } from "./EditDayMenu";
import moment from "moment";
import { AddExerciseRow } from "./AddExerciseRow";
import { useState } from "react";
import type { RoutineDayWithSets } from "@/types/routineDay";
import type { Units } from "@/actions/getUnits";
import { Settings } from "@mui/icons-material";
import { WorkoutList } from "../workoutSet/WorkoutList";

export const DayCard = ({
  routineDay,
  units,
}: {
  routineDay: RoutineDayWithSets;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);

  return (
    <>
      <Card sx={{ pb: 2 }}>
        <CardHeader
          title={
            <>
              <Typography variant="h5" gutterBottom>
                {routineDay.description}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {routineDay.weekdays.map((weekday) => (
                  <Chip
                    key={`day-${routineDay.id}-weekday-${weekday}`}
                    label={moment(weekday, "dddd").format("dddd")}
                  />
                ))}
              </Box>
            </>
          }
          action={<EditDayMenu routineDay={routineDay} icon={<Settings />} />}
        />

        <CardContent>
          <AddExerciseRow dayId={routineDay.id} />
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
          setGroups={routineDay.setGroups}
          units={units}
        />
      </Card>
    </>
  );
};
