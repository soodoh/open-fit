import { Box, Container, Typography } from "@mui/material";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/actions/getCurrentSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";

export default async function Sessions() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const sessions = await prisma.workoutSession.findMany({
    orderBy: { startTime: "desc" },
    where: { userId: session.user.id },
    include: {
      template: { include: { routine: true } },
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
  const currentSession = await getCurrentSession();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Workout Logs</Typography>
        <CreateSessionButton />
      </Box>

      {currentSession && (
        <Box sx={{ my: 3 }}>
          <ResumeSessionButton />
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {sessions.map((session) => (
          <SessionSummaryCard key={session.id} session={session} />
        ))}
      </Box>
    </Container>
  );
}
