import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-xl">{routine.name}</CardTitle>
          {routine.description && (
            <CardDescription className="text-sm font-medium">
              {routine.description}
            </CardDescription>
          )}
          <CardDescription className="text-xs">
            {`Last Updated: ${dayjs(routine.updatedAt).format("MM/DD/YYYY")}`}
          </CardDescription>
        </div>
        <EditRoutineMenu routine={routine} />
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0">
        <div className="space-y-0">
          {routine.routineDays.map((routineDay) => {
            return (
              <RoutineDayItem
                key={`${routine.id}-day-${routineDay.id}`}
                routineDay={routineDay}
                currentSession={currentSession}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
