"use client";

import { Container } from "@/components/ui/container";
import { WorkoutList } from "@/components/workoutSet/WorkoutList";
import { ListView } from "@/lib/convex-types";
import type { RoutineDayWithData, Units } from "@/lib/convex-types";

export const DayPage = ({
  routineDay,
  units,
}: {
  routineDay: RoutineDayWithData;
  units: Units;
}) => {
  return (
    <Container maxWidth="lg" className="p-0">
      <WorkoutList
        view={ListView.EditTemplate}
        sessionOrDayId={routineDay._id}
        setGroups={routineDay.setGroups}
        units={units}
      />
    </Container>
  );
};
