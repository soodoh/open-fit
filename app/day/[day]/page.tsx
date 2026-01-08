"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { DayPage } from "@/components/routines/DayPage";
import { EditDayMenu } from "@/components/routines/EditDayMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  return (
    <AuthGuard>
      <DayPageContent />
    </AuthGuard>
  );
}

function DayPageContent() {
  const params = useParams();
  const router = useRouter();
  const dayId = params.day as Id<"routineDays">;

  const routineDay = useQuery(api.queries.routineDays.get, { id: dayId });
  const currentSession = useQuery(api.queries.sessions.getCurrent);
  const units = useQuery(api.queries.units.list);

  // Redirect if routine day not found
  useEffect(() => {
    if (routineDay === null) {
      router.push("/routines");
    }
  }, [routineDay, router]);

  if (routineDay === undefined || units === undefined) {
    return (
      <Container maxWidth="lg" className="mt-8">
        <p className="text-muted-foreground">Loading...</p>
      </Container>
    );
  }

  if (!routineDay) {
    return null;
  }

  return (
    <>
      <Container maxWidth="lg" className="mt-8 flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">{routineDay.description}</h1>
          <EditDayMenu
            currentSession={currentSession}
            routineDay={routineDay}
            icon={<Settings />}
          />
        </div>
        <Button asChild>
          <Link href="/routines">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Routines
          </Link>
        </Button>
      </Container>

      <Container
        maxWidth="lg"
        className="my-4 flex flex-wrap items-center gap-2"
      >
        {routineDay.weekdays.map((weekday) => (
          <Badge
            key={`day-${routineDay._id}-weekday-${weekday}`}
            variant="secondary"
          >
            {dayjs().day(weekday).format("dddd")}
          </Badge>
        ))}
      </Container>

      <DayPage routineDay={routineDay} units={units} />
    </>
  );
}
