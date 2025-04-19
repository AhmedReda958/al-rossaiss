"use client";

import React, { useState, useEffect } from "react";
import { Stage, Layer, Path, Group, Image, Text } from "react-konva";
import regions from "./reigons";
import Konva from "konva";
import { renderToStaticMarkup } from "react-dom/server";
import useImage from "use-image";

const MapContainer = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const stageSize = {
    width: 1368,
    height: 1024,
  };
  const [pathDataMap, setPathDataMap] = useState<Record<string, string>>({});
  const [mapImage] = useImage("/map.png");

  // Extract path data on client-side only
  useEffect(() => {
    const extractedData: Record<string, string> = {};

    regions.forEach(({ Component, id }) => {
      const markup = renderToStaticMarkup(<Component />);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = markup;
      const pathElement = tempDiv.querySelector("path");
      extractedData[id] = pathElement?.getAttribute("d") || "";
    });

    setPathDataMap(extractedData);
  }, []);

  const handleRegionClick = (id: string) => {
    setSelectedRegion(id);
  };

  return (
    <Stage width={1368} height={1024}>
      <Layer width={1368} height={1024}>
        {mapImage && (
          <Image
            image={mapImage}
            width={stageSize.width}
            height={stageSize.height}
            alt="map"
            y={-180}
            x={-150}
            scaleX={1.25}
            scaleY={1.25}
          />
        )}
        <Group
          width={stageSize.width}
          height={stageSize.height}
          x={120}
          y={0}
          scaleX={0.95}
          scaleY={0.95}
        >
          {regions.map(({ id }) => {
            const pathData = pathDataMap[id] || "";

            if (!pathData) return null;

            return (
              <Path
                key={id}
                data={pathData}
                fill={selectedRegion === id ? "#3B82F6" : "white"}
                stroke={selectedRegion === id ? "#1D4ED8" : "#5E8894"}
                strokeWidth={selectedRegion === id ? 2 : 1}
                onClick={() => handleRegionClick(id)}
                onMouseEnter={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = "pointer";
                  }
                  // Use proper type assertion
                  const path = e.target as Konva.Path;
                  if (selectedRegion !== id) {
                    path.fill("#EBF5FF");
                  }
                  const layer = path.getLayer();
                  if (layer) {
                    layer.batchDraw();
                  }

                  // Set hovered region for tooltip
                  const pos = e.target.getStage()?.getPointerPosition();
                  if (pos) {
                    setTooltipPosition({ x: pos.x, y: pos.y - 30 });
                    setHoveredRegion(id);
                  }
                }}
                onMouseLeave={(e) => {
                  const container = e.target.getStage()?.container();
                  if (container) {
                    container.style.cursor = "default";
                  }
                  // Use proper type assertion
                  const path = e.target as Konva.Path;
                  if (selectedRegion !== id) {
                    path.fill("white");
                  }
                  const layer = path.getLayer();
                  if (layer) {
                    layer.batchDraw();
                  }

                  // Hide tooltip
                  setHoveredRegion(null);
                }}
              />
            );
          })}

          {/* Region name tooltip */}
          {hoveredRegion && (
            <Text
              text={regions.find((r) => r.id === hoveredRegion)?.name || ""}
              x={tooltipPosition.x}
              y={tooltipPosition.y}
              fontSize={16}
              fill="black"
              padding={5}
              background="white"
            />
          )}
        </Group>
      </Layer>
    </Stage>
  );
};

export default MapContainer;
