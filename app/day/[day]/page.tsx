import { getUnits } from "@/actions/getUnits";
import { auth } from "@/auth";
import { DayPage } from "@/components/routines/DayPage";
import { EditDayMenu } from "@/components/routines/EditDayMenu";
import { prisma } from "@/lib/prisma";
import { ArrowBack, Settings } from "@mui/icons-material";
import { Box, Button, Chip, Container, Typography } from "@mui/material";
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
      <Container
        maxWidth="lg"
        sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="h5" gutterBottom>
            {routineDay.description}
          </Typography>
          <EditDayMenu routineDay={routineDay} icon={<Settings />} />
        </Box>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          LinkComponent={Link}
          href="/routines"
        >
          Routines
        </Button>
      </Container>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          my: 1,
        }}
      >
        {routineDay.weekdays.map((weekday) => (
          <Chip
            key={`day-${routineDay.id}-weekday-${weekday}`}
            label={dayjs().day(weekday).format("dddd")}
          />
        ))}
      </Container>

      <DayPage routineDay={routineDay} units={units} />
    </>
  );
}
