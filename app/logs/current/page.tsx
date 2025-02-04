import { getUnits } from "@/actions/getUnits";
import { CurrentSession } from "@/components/sessions/CurrentSession";
import { EditSessionMenu } from "@/components/sessions/EditSessionMenu";
import { prisma } from "@/lib/prisma";
import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  // const { session: sessionParam } = await params;
  // const sessionId = parseInt(sessionParam, 10);

  // if (Number.isNaN(sessionId)) {
  //   redirect("/logs");
  // }

  const currentSession = await prisma.workoutSession.findFirst({
    where: {
      startTime: { gte: dayjs().subtract(1, "day").toDate() },
      endTime: null,
    },
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
  if (!currentSession) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4">No active session</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            variant="outlined"
            label={dayjs(currentSession.startTime).format("MM/DD/YYYY")}
          />

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            LinkComponent={Link}
            href="/logs"
          >
            Logs
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h4">{currentSession.name}</Typography>
          <EditSessionMenu session={currentSession} />
        </Box>
      </Container>

      <CurrentSession session={currentSession} units={units} />
    </>
  );
}
