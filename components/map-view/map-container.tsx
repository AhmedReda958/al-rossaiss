"use client";

import React, { useRef, useEffect } from "react";
import { Stage } from "react-konva";
import RegionsLayer from "./regions-layer";
import { useMapStore } from "@/lib/store";
const MapContainer = () => {
  const { mapSize } = useMapStore();

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

  return (
    <div
      ref={containerRef}
      className={`w-full h-full max-w-[${mapSize.width}px] max-h-[${mapSize.height}px] rounded-2xl  lg:aspect-video overflow-hidden bg-[#DBDCDC]`}
    >
      <Stage width={stageSize.width} height={stageSize.height}>
        <RegionsLayer />
      </Stage>
    </div>
  );
};

export default MapContainer;
