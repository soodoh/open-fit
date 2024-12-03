"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useRefreshToken } from "@/lib/useRefreshToken";
import { ACCESS_TOKEN_KEY } from "@/lib/constants";

function useToken() {
  const currentToken = localStorage?.getItem(ACCESS_TOKEN_KEY);
  const [accessToken, setAccessToken] = useState<string | null>(currentToken);

  useEffect(() => {
    setAccessToken(currentToken);
  }, [currentToken]);

  return accessToken;
}

export function useAccessToken() {
  const accessToken = useToken();
  const refreshToken = useRefreshToken();
  const router = useRouter();
  const { error, isLoading } = useSWR(
    {
      url: accessToken && "/token/verify",
      opts: {
        method: "POST",
        body: JSON.stringify({ token: accessToken }),
      },
    },
    fetcher,
  );

  // Refresh accessToken if invalid && refreshToken is still valid
  useEffect(() => {
    if (!refreshToken || isLoading || !error) {
      return;
    }
    fetcher({
      url: "/token/refresh",
      opts: {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      },
    }).then((data) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    });
  }, [accessToken, error, isLoading, refreshToken]);

  useEffect(() => {
    // Skip redirect if refreshToken is still valid
    if (refreshToken || isLoading) {
      return;
    }
    if (!accessToken || error) {
      router.push("/login");
    }
  }, [error, isLoading, accessToken, router, refreshToken]);

  return accessToken;
}
