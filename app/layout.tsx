import type { Metadata } from "next";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import "./globals.css";

export const metadata: Metadata = {
  title: "Wger",
  description: "Wger New UI",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppWrapper>{children}</AppWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
