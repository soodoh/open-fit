"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import { type ReactNode } from "react";

export const ThemeClient = ({ children }: { children: ReactNode }) => {
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: "inherit",
            textTransform: "none",
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
