import { DayCard } from "@/components/routines/DayCard";
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

  if (Number.isNaN(workoutId) || Number.isNaN(dayId)) {
    redirect("/routines");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <DayCard workoutId={workoutId} dayId={dayId} />
    </Container>
  );
}
