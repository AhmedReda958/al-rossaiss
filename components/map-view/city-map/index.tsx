import React, { useEffect, useState } from "react";
import { Image, Layer } from "react-konva";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { useCitiesLayer } from "@/lib/hooks/useCitiesLayer";

// Define a minimal city data type
interface CityData {
  imageUrl?: string;
  // Add other city fields as needed
}

const CityMap = () => {
  const { mapSize, selectedCity } = useMapStore();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [cityImage, setCityImage] = useState<HTMLImageElement | null>(null);

  const { isDrawingMode } = usePolygonMarkerStore();
  const {
    position,
    effectiveMapWidth,
    effectiveMapHeight,
    limitDragBoundaries,
    layerRef,
  } = useCitiesLayer();

  // Fetch city data when selectedCity changes
  useEffect(() => {
    if (!selectedCity) return;
    const fetchCity = async () => {
      const res = await fetch(`/api/cities/${selectedCity}`);
      if (res.ok) {
        const data = await res.json();
        setCityData(data);
        if (data.image) {
          const img = new window.Image();
          img.src = data.image;
          img.onload = () => setCityImage(img);
        } else {
          setCityImage(null);
        }
      } else {
        setCityData(null);
        setCityImage(null);
      }
    };
    fetchCity();
  }, [selectedCity]);

  if (!selectedCity || !cityData) return null;

  return (
    <Layer
      ref={layerRef}
      draggable={!isDrawingMode}
      width={effectiveMapWidth}
      height={effectiveMapHeight}
      dragBoundFunc={limitDragBoundaries}
      x={position.x}
      y={position.y}
    >
      {cityImage && (
        <Image
          image={cityImage}
          width={mapSize.width}
          height={mapSize.height}
          alt="city-map"
        />
      )}
      {/* Add city-specific layers/components here */}
    </Layer>
  );
};

export default CityMap;
