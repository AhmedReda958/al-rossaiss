import { routing } from "@/src/i18n/routing";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This ensures we only render localized content
  return children;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
