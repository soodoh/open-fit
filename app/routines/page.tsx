import { getCurrentSession } from "@/actions/getCurrentSession";
import { getRoutines } from "@/actions/getRoutines";
import { auth } from "@/auth";
import { CreateRoutine } from "@/components/routines/CreateRoutine";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { Box, Container, Grid, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Routines() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const routines = await getRoutines();
  const currentSession = await getCurrentSession();

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Routines</Typography>
        <CreateRoutine />
      </Box>

      <Grid container spacing={2}>
        {currentSession && (
          <Grid size={{ xs: 12 }}>
            <ResumeSessionButton session={currentSession} />
          </Grid>
        )}
        {routines?.map((routine) => (
          <Grid key={`routine-${routine.id}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <RoutineCard routine={routine} currentSession={currentSession} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
