import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Al-Rossais - Interactive Real Estate Map",
  description:
    "Explore cities, regions, real estate projects, and landmarks on our interactive mapping platform. Discover properties and developments across different regions.",
  keywords: ["real estate", "map", "properties", "cities", "regions", "projects", "landmarks"],
  authors: [{ name: "Al-Rossais" }],
  creator: "Al-Rossais",
  publisher: "Al-Rossais",
  robots: "index, follow",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: "/logo_large.png",
  },
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        {children}
      </body>
    </html>
  );
}
