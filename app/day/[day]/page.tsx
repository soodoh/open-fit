import { getUnits } from "@/actions/getUnits";
import { auth } from "@/auth";
import { DayCard } from "@/components/routines/DayCard";
import { EditDayMenu } from "@/components/routines/EditDayMenu";
import { prisma } from "@/lib/prisma";
import { ArrowBack, Settings } from "@mui/icons-material";
import { Box, Chip, Container, Fab, Typography } from "@mui/material";
import moment from "moment";
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
      routine: true,
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
    <>
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
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h5" gutterBottom>
            {routineDay.description}
          </Typography>
          <EditDayMenu routineDay={routineDay} icon={<Settings />} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {routineDay.weekdays.map((weekday) => (
            <Chip
              key={`day-${routineDay.id}-weekday-${weekday}`}
              label={moment(weekday, "dddd").format("dddd")}
            />
          ))}
        </Box>
      </Container>

      <DayCard routineDay={routineDay} units={units} />
    </>
  );
}
