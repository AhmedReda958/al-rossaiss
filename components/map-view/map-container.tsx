"use client";

import React, { useRef, useEffect } from "react";
import { Stage } from "react-konva";
import Konva from "konva";

import { useMapStore } from "@/lib/store";
import CountryMap from "./country-map";
import ControlsLayer from "./controls-layer";
import AddCityForm from "./controls-layer/forms/add-city";

const MapContainer = () => {
  const { mapSize, isAddingCity, setIsAddingCity } = useMapStore();
  const stageRef = useRef<Konva.Stage>(null);

  const [stageSize, setStageSize] = React.useState({
    width: mapSize.width,
    height: mapSize.height,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update stage dimensions when the window or container resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setStageSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    // Initial size calculation
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleCloseAddCityForm = () => {
    setIsAddingCity(false);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-full max-w-[${mapSize.width}px] max-h-[${mapSize.height}px] rounded-2xl lg:aspect-video overflow-hidden bg-[#DBDCDC] relative`}
      id="map_view"
    >
      <ControlsLayer>
        <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
          <CountryMap />
        </Stage>
        {isAddingCity && <AddCityForm onClose={handleCloseAddCityForm} />}
      </ControlsLayer>
    </div>
  );
};

export default MapContainer;
