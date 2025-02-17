"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { type ReactNode } from "react";
import { Header } from "./Header";
import { Roboto } from "next/font/google";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

dayjs.extend(duration);

export const AppWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
  const theme = createTheme({
    cssVariables: true,
    typography: {
      fontFamily: roboto.style.fontFamily,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Header />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
};
