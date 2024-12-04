"use client";
import { useAccessToken } from "@/lib/useAccessToken";

const BASE_URL = "https://wger.pauld.link/api/v2";

export const fetcher = async (url: string | null, opts?: RequestInit) => {
  if (!url) {
    return null;
  }
  const response = await fetch(BASE_URL + url, {
    mode: "cors",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...opts?.headers,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

export const useAuthFetcher = () => {
  const accessToken = useAccessToken();
  return (url: string | null) =>
    fetcher(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
};
