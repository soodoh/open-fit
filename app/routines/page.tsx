"use client";
import { useAuthFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/response";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutRoutine } from "@/components/routines/WorkoutRoutine";
import { Fab, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import sharedStyles from "@/styles/sharedPage.module.css";
import styles from "@/styles/routinePage.module.css";
import { useState } from "react";
import { EditRoutineModal } from "@/components/routines/EditRoutineModal";

export default function Routines() {
  const { data: workouts } = useSWR<PaginatedResponse<Workout>>(
    "/workout",
    useAuthFetcher(),
  );
  const [showEditModal, setEditModal] = useState(false);
  const [routine, setRoutine] = useState<Workout | null>(null);

  return (
    <div className={sharedStyles.page}>
      <div className={styles.titleContainer}>
        <Typography variant="h4">Workout Routines</Typography>
        <Fab
          color="primary"
          variant="extended"
          onClick={() => {
            setRoutine(null);
            setEditModal(true);
          }}
        >
          <Add sx={{ mr: 1 }} />
          Create Routine
        </Fab>
      </div>

      <EditRoutineModal
        open={showEditModal}
        onClose={() => setEditModal(false)}
        routine={routine}
      />

      {workouts?.results.map((workout) => (
        <WorkoutRoutine
          key={`routine-${workout.id}`}
          workout={workout}
          onEdit={() => {
            setRoutine(workout);
            setEditModal(true);
          }}
        />
      ))}
    </div>
  );
}
