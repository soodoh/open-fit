type FetchArgs = {
  url: string;
  accessToken?: string;
};

const BASE_URL = "https://wger.pauld.link/api/v2";

export const fetcher = async ({ url, accessToken }: FetchArgs) => {
  const response = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};
