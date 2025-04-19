"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("@/components/map-view/map-container"),
  {
    ssr: false,
  }
);

export default function MapView() {
  return <MapContainer />;
}
