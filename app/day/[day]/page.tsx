import { getCurrentSession } from "@/actions/getCurrentSession";
import { getRoutineDay } from "@/actions/getDay";
import { getUnits } from "@/actions/getUnits";
import { auth } from "@/auth";
import { DayPage } from "@/components/routines/DayPage";
import { EditDayMenu } from "@/components/routines/EditDayMenu";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const { day } = await params;
  const dayId = parseInt(day, 10);
  const routineDay = await getRoutineDay(dayId);
  if (!routineDay) {
    redirect("/routines");
  }

  const currentSession = await getCurrentSession();
  const units = await getUnits();

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

      <Container maxWidth="lg" className="my-4 flex flex-wrap items-center gap-2">
        {routineDay.weekdays.map((weekday) => (
          <Badge key={`day-${routineDay.id}-weekday-${weekday}`} variant="secondary">
            {dayjs().day(weekday).format("dddd")}
          </Badge>
        ))}
      </Container>

      <DayPage routineDay={routineDay} units={units} />
    </>
  );
}
