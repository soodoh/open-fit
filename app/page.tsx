"use client";
import styles from "./page.module.css";
import { useAuthFetcher } from "@/lib/fetcher";
import useSWR from "swr";

export default function Home() {
  const { data: workouts } = useSWR("/workout", useAuthFetcher());
  console.log(workouts);

  return <div className={styles.page}>Hello world!</div>;
}
