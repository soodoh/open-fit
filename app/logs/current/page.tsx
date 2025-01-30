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

  const session = await prisma.workoutSession.findFirst({
    // where: { id: sessionId },
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
            label={dayjs(session.startTime).format("MM/DD/YYYY")}
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
          <Typography variant="h4">{session.name}</Typography>
          <EditSessionMenu session={session} />
        </Box>
      </Container>

      <CurrentSession session={session} units={units} />
    </>
  );
}
