import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { EditDayMenu } from "./EditDayMenu";
import type { RoutineDay, WorkoutSessionWithData } from "@/lib/convex-types";

export const RoutineDayItem = ({
  routineDay,
  currentSession,
}: {
  routineDay: RoutineDay;
  currentSession: WorkoutSessionWithData | null;
}) => {
  return (
    <>
      <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
        <Link href={`/day/${routineDay._id}`} className="flex-1 min-w-0">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium leading-none">
              {routineDay.description}
            </h4>
            <div className="flex flex-wrap gap-1">
              {routineDay.weekdays.map((weekday) => (
                <Badge
                  key={`${routineDay._id}-weekday-chip-${weekday}`}
                  variant="secondary"
                  className="text-xs"
                >
                  {dayjs().day(weekday).format("ddd")}
                </Badge>
              ))}
            </div>
          </div>
        </Link>
        <EditDayMenu
          routineDay={routineDay}
          currentSession={currentSession}
          icon={<MoreHorizontal className="h-4 w-4" />}
        />
      </div>
      <Separator />
    </>
  );
};
