"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "./fetcher";
import { useRouter } from "next/navigation";
import { REFRESH_TOKEN_KEY } from "./constants";

function useToken() {
  const currentToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const [refreshToken, setRefreshToken] = useState<string | null>(currentToken);

  useEffect(() => {
    setRefreshToken(currentToken);
  }, [currentToken]);

  return refreshToken;
}

export function useRefreshToken() {
  const refreshToken = useToken();
  const router = useRouter();
  const { error, isLoading } = useSWR(
    {
      url: refreshToken && "/token/verify",
      opts: {
        method: "POST",
        body: JSON.stringify({ token: refreshToken }),
      },
    },
    fetcher,
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!refreshToken || error) {
      router.push("/login");
    }
  }, [error, isLoading, refreshToken, router]);

  return refreshToken;
}
