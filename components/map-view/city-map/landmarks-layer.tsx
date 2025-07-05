"use client";

import React, { useEffect } from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import LandmarkPin from "@/components/map-view/polygon/landmark-pin";
import { LandmarkType } from "@/lib/constants";

interface Landmark {
  id: number;
  name: string;
  type: LandmarkType;
  coordinates: {
    x: number;
    y: number;
  };
}

const LandmarksLayer = () => {
  const { selectedCityId, setLandmarks, landmarks, landmarkTypeInDrawing, hiddenLandmarkTypes } =
    useMapStore();
  const { coordinates, isDrawingMode } = usePolygonMarkerStore();

  useEffect(() => {
    const fetchCityLandmarks = async () => {
      if (!selectedCityId) return;

      try {
        const response = await fetch(`/api/cities/${selectedCityId}/landmarks`);
        if (!response.ok) throw new Error("Failed to fetch landmarks");

        const data = await response.json();
        setLandmarks(data);
      } catch (error) {
        console.error("Error fetching city landmarks:", error);
      }
    };

    fetchCityLandmarks();
  }, [selectedCityId, setLandmarks]);

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
      {visibleLandmarks?.map((landmark: Landmark) => (
        <LandmarkPin
          key={landmark.id}
          x={landmark.coordinates.x}
          y={landmark.coordinates.y}
          type={landmark.type}
          name={landmark.name}
          size={40}
          onClick={() => {
            console.log("Landmark clicked:", landmark.name);
          }}
        />
      ))}

      {/* Render dynamic landmark pin when in drawing mode */}
      {isDrawingMode && landmarkTypeInDrawing && coordinates.length === 2 && (
        <LandmarkPin
          x={coordinates[0]}
          y={coordinates[1]}
          type={landmarkTypeInDrawing}
          size={40}
        />
      )}
    </Group>
  );
};

export default LandmarksLayer;
