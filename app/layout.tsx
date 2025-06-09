import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Providers } from "./provider";
import { AppBar } from "@/components/AppBar";
export const metadata: Metadata = {
  title: "BuzzBet",
  description: "A real time Betting Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
