type FetchArgs = {
  url: string;
  accessToken?: string;
};

export const fetcher = async ({ url, accessToken }: FetchArgs) => {
  const response = await fetch(url, {
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
