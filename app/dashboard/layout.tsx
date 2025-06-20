import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto">{children}</main>
    </div>
  );
}
