"use client";
import styles from "./page.module.css";
import { useAuthFetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { PaginatedResponse } from "@/types/response";
import { Workout } from "@/types/privateApi/workout";
import { WorkoutRoutine } from "@/components/WorkoutRoutine";

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
