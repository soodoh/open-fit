import { AppWrapper } from "@/components/layout/AppWrapper";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
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
        <ConvexClientProvider>
          <AppWrapper>{children}</AppWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
