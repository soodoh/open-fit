"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRefreshToken } from "@/lib/useRefreshToken";

export function useAccessToken() {
  const refreshToken = useRefreshToken();

  // This is cached and revalidated as necessary
  const { data: newToken } = useSWR<{ access: string }>(
    refreshToken ? "/token/refresh" : null,
    (url: string) =>
      fetcher(url, {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      }),
  );

  return newToken?.access ?? null;
}
