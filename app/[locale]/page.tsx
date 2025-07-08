import MapView from "@/components/map-view";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <div className="container mx-auto " id="map-container">
        <MapView />
      </div>
    </main>
  );
}
