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
  const { data: workouts, mutate } = useSWR<PaginatedResponse<Workout>>(
    "/workout",
    useAuthFetcher(),
  );
  const [showEditModal, setEditModal] = useState(false);
  const [routine, setRoutine] = useState<Workout | null>(null);
  const authFetcher = useAuthFetcher();

  const saveRoutine = async ({
    name,
    description,
  }: Pick<Workout, "name" | "description">) => {
    const data = await authFetcher(
      routine?.id ? `/workout/${routine.id}` : "/workout/",
      {
        method: routine?.id ? "PUT" : "POST",
        body: JSON.stringify({
          name,
          description,
        }),
      },
    );
    setEditModal(false);
    if (!workouts) {
      return;
    }

    const optimisticUpdate = {
      ...workouts,
      results: [...workouts.results],
    };
    if (!routine?.id) {
      optimisticUpdate.count += 1;
      optimisticUpdate.results.unshift(data);
    } else {
      const index = optimisticUpdate.results.findIndex(
        (workout) => workout.id === routine?.id,
      );
      if (index > -1) {
        optimisticUpdate.results[index] = data;
      }
    }
    mutate(optimisticUpdate);
  };

  const deleteRoutine = async (id: number) => {
    authFetcher(`/workout/${id}/`, {
      method: "DELETE",
    });
    if (!workouts) {
      return;
    }
    const optimisticUpdate = {
      ...workouts,
      count: workouts.count - 1,
      results: workouts.results.filter((workout) => workout.id === id),
    };
    mutate(optimisticUpdate);
  };

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
        saveRoutine={saveRoutine}
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
          deleteRoutine={deleteRoutine}
        />
      ))}
    </div>
  );
}
