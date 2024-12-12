"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { REFRESH_TOKEN_KEY } from "@/lib/constants";

export function useRefreshToken() {
  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;
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

  return !isTokenInvalid && !isLoading ? refreshToken : null;
}
