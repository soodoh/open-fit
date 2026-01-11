"use client";

import { ThemeSync } from "@/components/providers/ThemeSync";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Roboto } from "next/font/google";
import { type ReactNode } from "react";
import { Header } from "./Header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

dayjs.extend(duration);

export const AppWrapper = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className={`${roboto.variable} flex min-h-dvh flex-col`}>
      <ThemeSync />
      <Header />
      {children}
    </div>
  );
};
