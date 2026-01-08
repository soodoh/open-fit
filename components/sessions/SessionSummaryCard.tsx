import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import Link from "next/link";
import { EditSessionMenu } from "./EditSessionMenu";
import type { WorkoutSessionWithData } from "@/lib/convex-types";

export const SessionSummaryCard = ({
  session,
}: {
  session: WorkoutSessionWithData;
}) => {
  const durationDate =
    session.startTime && session.endTime
      ? dayjs.duration(dayjs(session.endTime).diff(dayjs(session.startTime)))
      : null;
  const durationString = durationDate
    ? `${durationDate.hours()} hours, ${durationDate.minutes()} mins`
    : "Not entered";

  return (
    <Card className="min-w-[300px] flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-2">
          <CardTitle className="text-lg">{session.name}</CardTitle>
          <Badge variant="outline">
            {dayjs(session.startTime).format("MM/DD/YYYY")}
          </Badge>
        </div>
        <EditSessionMenu session={session} />
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Duration</p>
          <p className="text-sm text-muted-foreground">{durationString}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">General Impression</p>
          {session.impression ? (
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < session.impression!
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Not rated</p>
          )}
        </div>

        {session.notes && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Notes</p>
            <p className="text-sm text-muted-foreground">{session.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end">
        <Button asChild variant="ghost">
          <Link href={`/logs/${session._id}`}>View Session</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
