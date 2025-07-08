import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { setRequestLocale } from "next-intl/server";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4">{children}</main>
    </div>
  );
}
