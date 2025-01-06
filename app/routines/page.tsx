import { Box, Container, Typography } from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { CreateRoutine } from "@/components/routines/CreateRoutine";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Routines() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const routines = await prisma.routine.findMany({
    where: { userId: session.user.id },
    include: { routineDays: true },
  });

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Workout Routines</Typography>
        <CreateRoutine />
      </Box>

      <Grid container spacing={2}>
        {routines?.map((routine) => (
          <Grid key={`routine-${routine.id}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <RoutineCard routine={routine} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
