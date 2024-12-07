/** @jsxImportSource @emotion/react */
"use client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { type ReactNode } from "react";
import { Header } from "./Header";
import { Roboto } from "next/font/google";
import { css } from "@emotion/react";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <main
        css={css`
          display: flex;
          justify-content: center;
          flex-grow: 1;
          background-color: var(--background);
          color: var(--foreground);
        `}
      >
        {children}
      </main>
    </ThemeProvider>
  );
};
