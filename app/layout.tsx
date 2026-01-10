import { AppWrapper } from "@/components/layout/AppWrapper";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <AppWrapper>{children}</AppWrapper>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
