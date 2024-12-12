"use client";
import { useAccessToken } from "@/lib/useAccessToken";
import useSWR, { SWRResponse } from "swr";

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
  if (response.status === 204) {
    return response;
  }
  return response.json();
};

export const useAuthFetcher = () => {
  const accessToken = useAccessToken();

  return async (url: string | null, opts?: RequestInit) => {
    if (!accessToken) {
      return null;
    }
    return fetcher(url, {
      ...opts,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...opts?.headers,
      },
    });
  };
};

export const useAuthedSWR = <T>(url: string | null): SWRResponse<T> => {
  const accessToken = useAccessToken();
  return useSWR(accessToken ? url : null, useAuthFetcher());
};
