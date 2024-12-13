import { SessionPage } from "@/components/sessions/SessionPage";
import { ArrowBack } from "@mui/icons-material";
import { Container, Fab } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ session: string }>;
}) {
  const { session: sessionParam } = await params;
  const sessionId = parseInt(sessionParam, 10);

  if (Number.isNaN(sessionId)) {
    redirect("/session");
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Fab
        variant="extended"
        color="primary"
        sx={{ gap: 1, mb: 2 }}
        LinkComponent={Link}
        href="/session"
      >
        <ArrowBack />
        Sessions
      </Fab>

      <SessionPage sessionId={sessionId} />
    </Container>
  );
}
