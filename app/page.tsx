"use client";
import { useAccessToken } from "@/lib/useAccessToken";
import styles from "./page.module.css";

export default function Home() {
  const accessToken = useAccessToken();
  console.log("home accessToken", accessToken);
  return <div className={styles.page}>Hello world!</div>;
}
