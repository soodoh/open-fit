"use client";
import { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.css";
import { Button, TextField } from "@mui/material";
import { fetcher } from "@/lib/fetcher";

const BASE_URL = "https://wger.pauld.link/api/v2";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const { data } = useSWR(
    accessToken ? { url: `${BASE_URL}/workoutlog`, accessToken } : null,
    fetcher,
  );
  console.log(data);

  const login = async () => {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
  };

  return (
    <div className={styles.page}>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={login}>
        Submit
      </Button>
    </div>
  );
}
