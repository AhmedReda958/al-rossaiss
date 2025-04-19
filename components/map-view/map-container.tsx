"use client";

import React, { useState } from "react";
import { Stage } from "react-konva";
import RegionsLayer from "./regions-layer";

const MapContainer = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const stageSize = {
    width: 1368,
    height: 1024,
  };

  const handleRegionClick = (id: string) => {
    setSelectedRegion(id);
  };

  return (
    <Stage width={1368} height={1024}>
      <RegionsLayer
        stageSize={stageSize}
        selectedRegion={selectedRegion}
        onRegionClick={handleRegionClick}
      />
    </Stage>
  );
};

export default MapContainer;
