import { getCurrentSession } from "@/actions/getCurrentSession";
import { getSessions } from "@/actions/getSessions";
import { auth } from "@/auth";
import { CreateSessionButton } from "@/components/sessions/CreateSession";
import { ResumeSessionButton } from "@/components/sessions/ResumeSessionButton";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { Box, Container, Typography } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Sessions() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const sessions = await getSessions();
  const currentSession = await getCurrentSession();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Workout Logs</Typography>
        <CreateSessionButton />
      </Box>

      {currentSession && (
        <Box sx={{ my: 3 }}>
          <ResumeSessionButton session={currentSession} />
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {sessions.map((session) => (
          <SessionSummaryCard key={session.id} session={session} />
        ))}
      </Box>
    </Container>
  );
}
