import { AppWrapper } from "@/components/layout/AppWrapper";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "OpenFit",
  description: "Open source fitness app",
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
