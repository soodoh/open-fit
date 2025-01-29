"use client";

import { Container, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { AddExerciseRow } from "./AddExerciseRow";
import { useState } from "react";
import type { RoutineDayWithRelations } from "@/types/routineDay";
import type { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";

export const DayCard = ({
  routineDay,
  units,
}: {
  routineDay: RoutineDayWithRelations;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);

  return (
    <>
      <Container maxWidth="xl">
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
      </Container>

      <WorkoutList
        reorder={isReorderActive}
        setGroups={routineDay.setGroups}
        units={units}
      />
    </>
  );
};
