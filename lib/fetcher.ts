"use client";
import { useAccessToken } from "@/lib/useAccessToken";

type FetchArgs = {
  url: string | null;
  opts?: RequestInit;
};

const BASE_URL = "https://wger.pauld.link/api/v2";

export const fetcher = async ({ url, opts }: FetchArgs) => {
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
  return (url: string) =>
    fetcher({
      url,
      opts: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
};
