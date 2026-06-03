import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CPSL — Cyber-Physical Security Layer",
  description: "Cyber-Physical Incident Intelligence Platform for UK SMEs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
