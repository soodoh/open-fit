"use client";

import { WorkoutList } from "@/components/workoutSet/WorkoutList";
import { Container } from "@/components/ui/container";
import { ListView } from "@/types/constants";
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
    <Container maxWidth="lg" className="p-0">
      <WorkoutList
        view={ListView.EditTemplate}
        sessionOrDayId={routineDay.id}
        setGroups={routineDay.setGroups}
        units={units}
      />
    </Container>
  );
};
