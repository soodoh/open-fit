import { Card, CardHeader, Divider, List, Typography } from "@mui/material";
import dayjs from "dayjs";
import { EditRoutineMenu } from "./EditRoutineMenu";
import { RoutineDayItem } from "./RoutineDayItem";
import type { Prisma, WorkoutSession } from "@/prisma/generated/client";

export async function RoutineCard({
  routine,
  currentSession,
}: {
  routine: Prisma.RoutineGetPayload<{ include: { routineDays: true } }>;
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

      <List dense disablePadding sx={{ flexGrow: 1 }}>
        <Divider />
        {routine.routineDays.map((routineDay) => {
          return (
            <RoutineDayItem
              key={`day-${routineDay.id}`}
              routineDay={routineDay}
              currentSession={currentSession}
            />
          );
        })}
      </List>
    </Card>
  );
}
