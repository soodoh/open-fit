import { WorkoutRoutine } from "@/components/routines/WorkoutRoutine";
import { Container } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ routine: string }>;
}) {
  const { routine } = await params;
  const workoutId = parseInt(routine, 10);

  if (Number.isNaN(workoutId)) {
    redirect("/routines");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <WorkoutRoutine workoutId={workoutId} />
    </Container>
  );
}
