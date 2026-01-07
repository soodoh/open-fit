"use client";

import { Units } from "@/actions/getUnits";
import { WorkoutList } from "@/components/workoutSet/WorkoutList";
import { ListView } from "@/types/constants";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import dayjs from "dayjs";
import Link from "next/link";
import { CurrentDuration } from "./CurrentDuration";
import { EditSessionMenu } from "./EditSessionMenu";
import type { SessionWithRelations } from "@/types/workoutSession";

export const CurrentSessionPage = ({
  session,
  units,
}: {
  session: SessionWithRelations;
  units: Units;
}) => {
  return (
    <>
      <Container maxWidth="lg">
        <div className="my-6 flex justify-between items-center">
          <Badge variant="outline">
            {dayjs(session.startTime).format("MM/DD/YYYY")}
          </Badge>

          <Button asChild>
            <Link href="/logs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Logs
            </Link>
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <h1 className="text-3xl font-bold">{session.name}</h1>
          <EditSessionMenu session={session} />
        </div>
      </Container>

      <Container maxWidth="lg">
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrentDuration startTime={session.startTime} />

          {session.notes && (
            <div>
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="text-sm text-muted-foreground">{session.notes}</p>
            </div>
          )}
        </div>
      </Container>

      <Container maxWidth="lg" className="px-0">
        <WorkoutList
          view={ListView.CurrentSession}
          sessionOrDayId={session.id}
          setGroups={session.setGroups}
          units={units}
        />
      </Container>
    </>
  );
};
