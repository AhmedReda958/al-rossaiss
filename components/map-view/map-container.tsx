"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage } from "react-konva";
import RegionsLayer from "./regions-layer";

const MapContainer = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const mapSize = {
    width: 1368,
    height: 1024,
  };
  const [stageSize, setStageSize] = useState({
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

  const handleRegionClick = (id: string) => {
    setSelectedRegion(id);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-2xl aspect-video overflow-hidden bg-[#DBDCDC]"
    >
      <Stage width={stageSize.width} height={stageSize.height}>
        <RegionsLayer
          mapSize={mapSize}
          selectedRegion={selectedRegion}
          onRegionClick={handleRegionClick}
        />
      </Stage>
    </div>
  );
};

export default MapContainer;
