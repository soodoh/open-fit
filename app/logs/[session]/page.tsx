import { getUnits } from "@/actions/getUnits";
import { EditSessionMenu } from "@/components/sessions/EditSessionMenu";
import { SessionPage } from "@/components/sessions/SessionPage";
import { prisma } from "@/lib/prisma";
import { ArrowBack } from "@mui/icons-material";
import { Box, Chip, Container, Fab, Typography } from "@mui/material";
import moment from "moment";
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
  const units = await getUnits();
  if (!session) {
    redirect("/logs");
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
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

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h4">{session.name}</Typography>
          <EditSessionMenu session={session} />
        </Box>
        <Chip
          sx={{ mt: 1, mb: 2 }}
          variant="outlined"
          label={moment(session.startTime).format("MM/DD/YYYY")}
        />
      </Container>

      <SessionPage session={session} units={units} />
    </>
  );
}
