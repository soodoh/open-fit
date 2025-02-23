"use client";

import { Container } from "@mui/material";
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
  return (
    <Container disableGutters maxWidth="lg">
      <WorkoutList
        view={ListView.EditTemplate}
        sessionOrDayId={routineDay.id}
        setGroups={routineDay.setGroups}
        units={units}
      />
    </Container>
  );
};
