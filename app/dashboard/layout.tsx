import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Al-Rossais",
  description:
    "Manage cities, regions, projects, and landmarks on the Al-Rossais platform",
};

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
