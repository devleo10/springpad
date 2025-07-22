import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hydration error fix: ensure font variables and Tailwind classes are only set after client mount
  // This avoids SSR/CSR mismatch for font variables
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  return (
    <html lang="en">
      <body
        className={mounted ? `${geistSans.variable} ${geistMono.variable} antialiased bg-transparent` : "antialiased bg-transparent"}
      >
        {children}
      </body>
    </html>
  );
}
