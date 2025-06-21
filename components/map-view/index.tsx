"use client";

import { useMapStore } from "@/lib/store";
import dynamic from "next/dynamic";
import { useLayoutEffect } from "react";
import { TMapType } from "@/app/types/map";

const MapContainer = dynamic(
  () => import("@/components/map-view/map-container"),
  {
    ssr: false,
  }
);

export default function MapView({ type = "main" }: { type?: TMapType }) {
  const { setMapType } = useMapStore();

  useLayoutEffect(() => {
    setMapType(type);
  }, [setMapType, type]);

  return <MapContainer />;
}
