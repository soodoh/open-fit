"use client";

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Syncs the user's theme preference from the database to next-themes.
 * This runs when the user is authenticated and their profile is loaded.
 */
export function ThemeSync() {
  const { isAuthenticated } = useConvexAuth();
  const profileData = useQuery(
    api.queries.userProfiles.getCurrent,
    isAuthenticated ? {} : "skip",
  );
  const { setTheme } = useTheme();

  useEffect(() => {
    if (profileData?.profile?.theme) {
      setTheme(profileData.profile.theme);
    }
  }, [profileData?.profile?.theme, setTheme]);

  return null;
}
