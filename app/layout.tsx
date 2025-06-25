import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Providers } from "./provider";
import { AppBar } from "@/components/AppBar";
import { ToastContainer, Bounce } from 'react-toastify';
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
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
