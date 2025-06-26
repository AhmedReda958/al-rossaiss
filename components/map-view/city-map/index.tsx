import React, { useEffect, useState } from "react";
import { Image, Layer } from "react-konva";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { useCitiesLayer } from "@/lib/hooks/useCitiesLayer";
import ProjectsLayer from "./projects-layer";

// Define a minimal city data type
interface CityData {
  imageUrl?: string;
  // Add other city fields as needed
}

const CityMap = () => {
  const { mapSize, selectedCity, setProjects } = useMapStore();
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

  // Fetch city data and projects when selectedCity changes
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
    const fetchProjects = async () => {
      const res = await fetch(`/api/projects/city/${selectedCity}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        setProjects([]);
      }
    };
    fetchCity();
    fetchProjects();
  }, [selectedCity, setProjects]);

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
      <ProjectsLayer />
    </Layer>
  );
};

export default CityMap;
