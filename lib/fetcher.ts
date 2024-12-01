"use client";

type FetchArgs = {
  url: string | null;
  accessToken?: string;
  opts?: RequestInit;
};

const BASE_URL = "https://wger.pauld.link/api/v2";

export const fetcher = async ({ url, accessToken, opts }: FetchArgs) => {
  const response = await fetch(BASE_URL + url, {
    mode: "cors",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...opts?.headers,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};
