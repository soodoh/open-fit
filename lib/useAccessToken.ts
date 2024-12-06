"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRefreshToken } from "@/lib/useRefreshToken";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";

function useToken() {
  const currentToken =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  const [accessToken, setAccessToken] = useState<string | null>(currentToken);

  useEffect(() => {
    setAccessToken(currentToken);
  }, [currentToken]);

  return accessToken;
}

export function useAccessToken() {
  const accessToken = useToken();
  const refreshToken = useRefreshToken();
  const { error: isTokenInvalid, isLoading } = useSWR(accessToken, (token) =>
    fetcher("/token/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  );

  // Refresh accessToken if invalid && refreshToken is still valid
  useEffect(() => {
    if (!refreshToken || isLoading || !isTokenInvalid) {
      return;
    }
    fetcher("/token/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    }).then((data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    });
  }, [accessToken, isTokenInvalid, isLoading, refreshToken]);

  return accessToken;
}
