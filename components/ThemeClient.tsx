"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import { type ReactNode } from "react";

export const ThemeClient = ({ children }: { children: ReactNode }) => {
  const theme = createTheme({
    cssVariables: true,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
