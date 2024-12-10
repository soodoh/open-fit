import { WorkoutDay } from "@/components/routines/WorkoutDay";
import { Container } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ routine: string; day: string }>;
}) {
  const { routine, day } = await params;
  const workoutId = parseInt(routine, 10);
  const dayId = parseInt(day, 10);

  console.log({ workoutId, dayId });

  if (Number.isNaN(workoutId) || Number.isNaN(dayId)) {
    redirect("/routines");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <WorkoutDay workoutId={workoutId} dayId={dayId} />
    </Container>
  );
}
