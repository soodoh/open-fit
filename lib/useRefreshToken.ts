"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { REFRESH_TOKEN_KEY } from "@/lib/constants";

function useToken() {
  const currentToken = localStorage?.getItem(REFRESH_TOKEN_KEY);
  const [refreshToken, setRefreshToken] = useState<string | null>(currentToken);

  useEffect(() => {
    setRefreshToken(currentToken);
  }, [currentToken]);

  return refreshToken;
}

export function useRefreshToken() {
  const refreshToken = useToken();
  const router = useRouter();
  const { error: isTokenInvalid, isLoading } = useSWR(refreshToken, (token) =>
    fetcher("/token/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!refreshToken || isTokenInvalid) {
      router.push("/login");
    }
  }, [isTokenInvalid, isLoading, refreshToken, router]);

  return refreshToken;
}
