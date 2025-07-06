"use client";

import React, { useEffect, useState } from "react";
import { Image, Layer, Circle } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { useCitiesLayer } from "@/lib/hooks/useCitiesLayer";
import ProjectsLayer from "./projects-layer";
import DrawingPolygon from "../polygon/drawing-polygon";
import LandmarksLayer from "./landmarks-layer";
import { LANDMARK_TYPES } from "@/lib/constants";
import LandmarkPin from "../polygon/landmark-pin";

// Define a minimal city data type
interface CityData {
  id: number;
  imageUrl?: string;
  // Add other city fields as needed
}

const CityMap = () => {
  const { mapSize, selectedCity, mapType, setSelectedCityId } = useMapStore();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [cityImage, setCityImage] = useState<HTMLImageElement | null>(null);

  const { isDrawingMode, coordinates, setCoordinates } =
    usePolygonMarkerStore();
  const {
    position,
    effectiveMapWidth,
    effectiveMapHeight,
    limitDragBoundaries,
    layerRef,
  } = useCitiesLayer();

  // Handle map click for landmark placement
  const handleLayerClick = (e: KonvaEventObject<MouseEvent>) => {
    if (isDrawingMode && mapType === "add-landmark") {
      const layerPoint = layerRef.current?.getRelativePointerPosition();
      if (layerPoint) {
        setCoordinates(layerPoint.x, layerPoint.y);
      }
    }
  };

  // Fetch city data and projects when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setSelectedCityId(null);
      return;
    }

    const fetchCity = async () => {
      const res = await fetch(`/api/cities/${selectedCity}`);
      if (res.ok) {
        const data = await res.json();
        setCityData(data);
        setSelectedCityId(data.id);
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
        setSelectedCityId(null);
      }
    };

    fetchCity();
  }, [selectedCity, setSelectedCityId]);

  if (!selectedCity || !cityData) return null;

  const showDrawingPolygon =
    isDrawingMode && (mapType === "add-project" || mapType === "edit-project");

  return (
    <Layer
      ref={layerRef}
      draggable={!isDrawingMode}
      width={effectiveMapWidth}
      height={effectiveMapHeight}
      dragBoundFunc={limitDragBoundaries}
      x={position.x}
      y={position.y}
      onClick={handleLayerClick}
    >
      {cityImage && (
        <Image
          image={cityImage}
          width={mapSize.width}
          height={mapSize.height}
          alt="city-map"
        />
      )}
      <ProjectsLayer />
      <LandmarksLayer />
      {showDrawingPolygon && <DrawingPolygon />}
    </Layer>
  );
};

export default CityMap;
