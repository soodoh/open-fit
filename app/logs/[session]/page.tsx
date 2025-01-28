import { getUnits } from "@/actions/getUnits";
import { SessionPage } from "@/components/sessions/SessionPage";
import { prisma } from "@/lib/prisma";
import { ArrowBack } from "@mui/icons-material";
import { Container, Fab } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: sessionParam } = await params;
  const sessionId = parseInt(sessionParam, 10);

  if (Number.isNaN(sessionId)) {
    redirect("/logs");
  }

  const session = await prisma.workoutSession.findUnique({
    where: { id: sessionId },
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
  const units = await getUnits();
  if (!session) {
    redirect("/logs");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Fab
        variant="extended"
        color="primary"
        sx={{ gap: 1, mb: 2 }}
        LinkComponent={Link}
        href="/logs"
      >
        <ArrowBack />
        Workout Logs
      </Fab>

      <SessionPage session={session} units={units} />
    </Container>
  );
}
