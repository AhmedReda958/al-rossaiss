"use client";

import React, { useEffect } from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import LandmarkPin from "@/components/map-view/polygon/landmark-pin";
import CustomLandmarkLogo from "@/components/map-view/polygon/custom-landmark-logo";
import { LandmarkType, LANDMARK_TYPES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { getLocalizedName } from "@/lib/utils";

interface Landmark {
  id: number;
  name: string;
  nameAr?: string;
  type: LandmarkType;
  image?: string; // Add image field
  coordinates: {
    x: number;
    y: number;
  };
}

const LandmarksLayer = () => {
  const {
    selectedCityId,
    setLandmarks,
    landmarks,
    landmarkTypeInDrawing,
    hiddenLandmarkTypes,
    addLoadingOperation,
    removeLoadingOperation,
    scale, // Add scale from map store
  } = useMapStore();
  const { coordinates, isDrawingMode } = usePolygonMarkerStore();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  useEffect(() => {
    const fetchCityLandmarks = async () => {
      if (!selectedCityId) return;

      addLoadingOperation("landmarks-data"); // Start loading when fetching landmarks

      try {
        const response = await fetch(`/api/cities/${selectedCityId}/landmarks`);
        if (!response.ok) throw new Error("Failed to fetch landmarks");

        const data = await response.json();
        setLandmarks(data);
      } catch (error) {
        console.error("Error fetching city landmarks:", error);
      } finally {
        removeLoadingOperation("landmarks-data"); // Stop loading after fetching
      }
    };

    fetchCityLandmarks();
  }, [
    selectedCityId,
    setLandmarks,
    addLoadingOperation,
    removeLoadingOperation,
  ]);

  // Filter landmarks based on hidden types
  const visibleLandmarks = landmarks?.filter(
    (landmark) => !hiddenLandmarkTypes.has(landmark.type)
  );

  if (!visibleLandmarks?.length && !isDrawingMode) {
    return null;
  }

  return (
    <Group>
      {/* Render existing landmarks */}
      {visibleLandmarks?.map((landmark: Landmark) => {
        const landmarkName = getLocalizedName(landmark, currentLocale);

        // Use custom logo for landmark type with image, otherwise use pin
        if (landmark.type === LANDMARK_TYPES.LANDMARK && landmark.image) {
          return (
            <CustomLandmarkLogo
              key={landmark.id}
              x={landmark.coordinates.x}
              y={landmark.coordinates.y}
              name={landmarkName}
              imageUrl={landmark.image}
              size={40}
            />
          );
        }

        return (
          <LandmarkPin
            key={landmark.id}
            x={landmark.coordinates.x}
            y={landmark.coordinates.y}
            type={landmark.type}
            name={landmarkName}
            size={24}
            scale={scale}
            onClick={() => {
              console.log("Landmark clicked:", landmarkName);
            }}
          />
        );
      })}

      {/* Render dynamic landmark pin when in drawing mode */}
      {isDrawingMode && landmarkTypeInDrawing && coordinates.length === 2 && (
        <LandmarkPin
          x={coordinates[0]}
          y={coordinates[1]}
          type={landmarkTypeInDrawing}
          size={24}
          scale={scale}
        />
      )}
    </Group>
  );
};

export default LandmarksLayer;
