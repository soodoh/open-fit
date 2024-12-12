"use client";
import { Container } from "@mui/material";
import { useAuthedSWR } from "@/lib/fetcher";

export default function WorkoutLogs() {
  const { data: workoutLogs } = useAuthedSWR("/workoutlog");
  const { data: sessions } = useAuthedSWR("/workoutsession");

  console.log({ workoutLogs, sessions });
  return <Container maxWidth="xl" sx={{ mt: 3 }}></Container>;
}
