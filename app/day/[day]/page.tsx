import { DayCard } from "@/components/routines/DayCard";
import { ArrowBack } from "@mui/icons-material";
import { Container, Fab } from "@mui/material";
import Link from "next/link";
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
      <DayCard dayId={dayId} />
    </Container>
  );
}
