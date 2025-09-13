import { Card, CardHeader, Divider, List, Typography } from "@mui/material";
import dayjs from "dayjs";
import { EditRoutineMenu } from "./EditRoutineMenu";
import { RoutineDayItem } from "./RoutineDayItem";
import type { WorkoutSession } from "@/prisma/generated/client";
import type { RoutineWithRelations } from "@/types/routine";

export async function RoutineCard({
  routine,
  currentSession,
}: {
  routine: RoutineWithRelations;
  currentSession: WorkoutSession | null;
}) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardHeader
        action={<EditRoutineMenu routine={routine} />}
        title={routine.name}
        subheader={
          <>
            {routine.description && (
              <Typography variant="subtitle2">{routine.description}</Typography>
            )}
            <Typography variant="caption" gutterBottom>
              {`Last Updated: ${dayjs(routine.updatedAt).format("MM/DD/YYYY")}`}
            </Typography>
          </>
        }
      />

      <Divider />

      <List dense disablePadding sx={{ flexGrow: 1 }}>
        {routine.routineDays.map((routineDay) => {
          return (
            <RoutineDayItem
              key={`${routine.id}-day-${routineDay.id}`}
              routineDay={routineDay}
              currentSession={currentSession}
            />
          );
        })}
      </List>
    </Card>
  );
}
