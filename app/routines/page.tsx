"use client";
import { useAuthedSWR } from "@/lib/fetcher";
import { PaginatedResponse } from "@/types/response";
import { Workout } from "@/types/privateApi/workout";
import { Box, Container, Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Grid2 as Grid } from "@mui/material";
import { useState } from "react";
import { EditRoutineModal as CreateRoutineModal } from "@/components/routines/EditRoutineModal";
import { RoutineCard } from "@/components/routines/RoutineCard";
import { WORKOUTS } from "@/lib/urls";

export default function Routines() {
  const { data: workouts } = useAuthedSWR<PaginatedResponse<Workout>>(WORKOUTS);
  const [showEditModal, setEditModal] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Workout Routines</Typography>
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setEditModal(true)}
        >
          <Add sx={{ mr: 1 }} />
          Create Routine
        </Fab>
      </Box>

      <CreateRoutineModal
        open={showEditModal}
        onClose={() => setEditModal(false)}
      />

      <Grid container spacing={2}>
        {workouts?.results?.map((workout) => (
          <Grid key={`routine-${workout.id}`} size={{ xs: 12, sm: 6, md: 4 }}>
            <RoutineCard workoutId={workout.id} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
