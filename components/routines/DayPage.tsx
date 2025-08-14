"use client";

import { WorkoutList } from "@/components/workoutSet/WorkoutList";
import { ListView } from "@/types/constants";
import { Container } from "@mui/material";
import type { Units } from "@/actions/getUnits";
import type { RoutineDayWithRelations } from "@/types/routineDay";

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
