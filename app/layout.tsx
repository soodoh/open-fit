import { AppWrapper } from "@/components/layout/AppWrapper";
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
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
