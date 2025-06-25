import React, { useEffect, useState, useRef } from "react";
import { Image, Layer } from "react-konva";
import Konva from "konva";
import { useMapStore } from "@/lib/store";

// Define a minimal city data type
interface CityData {
  imageUrl?: string;
  // Add other city fields as needed
}

const CityMap = () => {
  const { mapSize, selectedCity } = useMapStore();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [cityImage, setCityImage] = useState<HTMLImageElement | null>(null);
  const layerRef = useRef<Konva.Layer>(null);

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

  console.log(cityImage);
  return (
    <Layer ref={layerRef} width={mapSize.width} height={mapSize.height}>
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
