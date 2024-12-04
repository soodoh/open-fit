"use client";
import { useAuthFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/response";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutRoutine } from "@/components/routines/WorkoutRoutine";
import styles from "@/styles/sharedPage.module.css";

export default function Home() {
  const { data: workouts } = useSWR<PaginatedResponse<Workout>>(
    "/workout",
    useAuthFetcher(),
  );

  return (
    <div className={styles.page}>
      {workouts?.results.map((workout) => (
        <WorkoutRoutine key={`routine-${workout.id}`} workout={workout} />
      ))}
    </div>
  );
}
