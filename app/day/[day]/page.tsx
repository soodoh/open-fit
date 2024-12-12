import { DayCard } from "@/components/routines/DayCard";
import { Container } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const dayId = parseInt(day, 10);

  if (Number.isNaN(dayId)) {
    redirect("/routines");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <DayCard dayId={dayId} />
    </Container>
  );
}
