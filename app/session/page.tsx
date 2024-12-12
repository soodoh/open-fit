"use client";
import { Box, Container, Fab, Typography } from "@mui/material";
import { useAuthedSWR } from "@/lib/fetcher";
import { Add } from "@mui/icons-material";
import { PaginatedResponse } from "@/types/response";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";

export default function Sessions() {
  const { data: sessions } =
    useAuthedSWR<PaginatedResponse<WorkoutSession>>("/workoutsession");

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Fab color="primary" variant="extended" sx={{ mb: 2 }}>
        <Add sx={{ mr: 1 }} />
        Start New Session
      </Fab>

      <Typography variant="h4" gutterBottom>
        In Progress
      </Typography>
      <Typography variant="h4" gutterBottom>
        Previous Workout Sessions
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {sessions?.results?.map((session) => (
          <SessionSummaryCard key={session.id} sessionId={session.id} />
        ))}
      </Box>
    </Container>
  );
}
