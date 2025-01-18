import { getUnits } from "@/actions/getUnits";
import { auth } from "@/auth";
import { DayCard } from "@/components/routines/DayCard";
import { prisma } from "@/lib/prisma";
import { ArrowBack } from "@mui/icons-material";
import { Container, Fab } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { day } = await params;
  const dayId = parseInt(day, 10);
  const routineDay = await prisma.routineDay.findUnique({
    where: { id: dayId },
    include: {
      setGroups: {
        orderBy: { order: "asc" },
        include: {
          sets: {
            orderBy: { order: "asc" },
            include: { exercise: true, repetitionUnit: true, weightUnit: true },
          },
        },
      },
    },
  });
  if (!routineDay) {
    redirect("/routines");
  }

  const units = await getUnits();

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Fab
        variant="extended"
        color="primary"
        sx={{ gap: 1, mb: 2 }}
        LinkComponent={Link}
        href="/routines"
      >
        <ArrowBack />
        Routines
      </Fab>
      <DayCard routineDay={routineDay} units={units} />
    </Container>
  );
}
