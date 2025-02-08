"use client";

import { Container, FormControlLabel, FormGroup, Switch } from "@mui/material";
import { AddExerciseRow } from "./AddExerciseRow";
import { useState } from "react";
import type { RoutineDayWithRelations } from "@/types/routineDay";
import type { Units } from "@/actions/getUnits";
import { WorkoutList } from "../workoutSet/WorkoutList";
import { ListView } from "@/types/constants";

export const DayPage = ({
  routineDay,
  units,
}: {
  routineDay: RoutineDayWithRelations;
  units: Units;
}) => {
  const [isReorderActive, setReorderActive] = useState(false);

  return (
    <>
      <Container maxWidth="lg">
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

      <Container disableGutters maxWidth="lg">
        <WorkoutList
          view={ListView.EditTemplate}
          reorder={isReorderActive}
          setGroups={routineDay.setGroups}
          units={units}
        />
      </Container>
    </>
  );
};
