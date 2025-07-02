"use client";

import React, { useEffect } from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
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
  const { selectedCityId, setLandmarks, landmarks } = useMapStore();

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

  if (!landmarks?.length) {
    return null;
  }

  return (
    <Group>
      {landmarks.map((landmark: Landmark) => (
        <LandmarkPin
          key={landmark.id}
          x={landmark.coordinates.x}
          y={landmark.coordinates.y}
          type={landmark.type}
          size={24}
          onClick={() => {
            console.log("Landmark clicked:", landmark.name);
          }}
        />
      ))}
    </Group>
  );
};

export default LandmarksLayer;
