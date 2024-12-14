"use client";
import { Box, Container, Fab, Typography } from "@mui/material";
import { useAuthedSWR } from "@/lib/fetcher";
import { Add } from "@mui/icons-material";
import { PaginatedResponse } from "@/types/response";
import { WorkoutSession } from "@/types/privateApi/workoutSession";
import { SessionSummaryCard } from "@/components/sessions/SessionSummaryCard";
import { EditSessionModal as NewSessionModal } from "@/components/sessions/EditSessionModal";
import { SESSIONS } from "@/lib/urls";
import { useState } from "react";

export default function Sessions() {
  const { data: sessions } =
    useAuthedSWR<PaginatedResponse<WorkoutSession>>(SESSIONS);
  const sessionItems = sessions?.results ?? [];

  const [open, setOpen] = useState(false);

  return (
    <>
      <NewSessionModal open={open} onClose={() => setOpen(false)} />

      <Container maxWidth="xl" sx={{ my: 3 }}>
        <Fab
          color="primary"
          variant="extended"
          sx={{ mb: 2 }}
          onClick={() => setOpen(true)}
        >
          <Add sx={{ mr: 1 }} />
          Create Session
        </Fab>

        <Typography variant="h4" gutterBottom>
          In Progress
        </Typography>
        <Typography variant="h4" gutterBottom>
          Previous Workout Sessions
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {sessionItems.map((session) => (
            <SessionSummaryCard key={session.id} sessionId={session.id} />
          ))}
        </Box>
      </Container>
    </>
  );
}
