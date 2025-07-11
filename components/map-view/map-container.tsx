"use client";

import React, { useRef, useEffect } from "react";
import { Stage } from "react-konva";
import Konva from "konva";

import { useMapStore } from "@/lib/store";
import CountryMap from "./country-map";
import CityMap from "./city-map";
import ControlsLayer from "./controls-layer";
import MapLoading from "./map-loading";

const MapContainer = () => {
  const {
    mapSize,
    mapType,
    selectedCity,
    isLoading,
    updateInitialPosition,
    forceCenter,
  } = useMapStore();
  const stageRef = useRef<Konva.Stage>(null);

  const [stageSize, setStageSize] = React.useState({
    width: mapSize.width,
    height: mapSize.height,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Add effect to ensure proper centering after stage is ready
  useEffect(() => {
    if (stageRef.current && stageSize.width > 0 && stageSize.height > 0) {
      // Small delay to ensure the stage is fully rendered
      const timer = setTimeout(() => {
        updateInitialPosition(stageSize.width, stageSize.height);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [stageSize.width, stageSize.height, updateInitialPosition]);

  // Additional effect to handle stage readiness and force centering for production
  useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current;

      // Ensure stage is properly initialized
      const checkStageReady = () => {
        if (stage.width() > 0 && stage.height() > 0) {
          updateInitialPosition(stage.width(), stage.height());

          // In production, sometimes we need to force center after everything is loaded
          setTimeout(() => {
            forceCenter();
          }, 200);
        } else {
          setTimeout(checkStageReady, 50);
        }
      };

      checkStageReady();
    }
  }, [updateInitialPosition, forceCenter]);

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

  // Determine if we should show the city map
  const shouldShowCityMap =
    selectedCity &&
    (mapType === "main" ||
      mapType === "add-project" ||
      mapType === "edit-project" ||
      mapType === "add-landmark" ||
      mapType === "edit-landmark");

  return (
    <div
      ref={containerRef}
      className={`w-full h-full max-w-[${mapSize.width}px] max-h-[${mapSize.height}px] max-h-[100vh]  lg:aspect-video overflow-hidden bg-[#DBDCDC] relative`}
      id="map_view"
      dir="ltr"
    >
      <MapLoading isLoading={isLoading} />
      <ControlsLayer>
        <Stage width={stageSize.width} height={stageSize.height} ref={stageRef}>
          {shouldShowCityMap ? <CityMap /> : <CountryMap />}
        </Stage>
      </ControlsLayer>
    </div>
  );
};

export default MapContainer;
