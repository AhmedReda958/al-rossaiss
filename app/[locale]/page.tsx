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
    <main>
      <div id="map-container">
        <MapView />
      </div>
    </main>
  );
}
