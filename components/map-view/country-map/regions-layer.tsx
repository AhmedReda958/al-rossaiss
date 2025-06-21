import React, { useState, useEffect } from "react";
import { Group, Path, Text, Circle, Rect } from "react-konva";
import Konva from "konva";

import regions from "./regions";

import colors from "@/lib/colors";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";
import { useMapStore } from "@/lib/store";

// Define region positions for labels
const regionLabelPositions: Record<string, { x: number; y: number }> = {
  western: { x: 150, y: 300 },
  eastern: { x: 830, y: 350 },
  northern: { x: 250, y: 30 },
  southern: { x: 400, y: 550 },
  central: { x: 450, y: 250 },
};

const RegionsLayer = () => {
  const {
    pathDataMap,
    hoveredRegionId,
    selectedRegion,
    setHoveredRegionId,
    handleRegionClick,
    assignPathRef,
  } = useRegionsLayer();
  const { mapType } = useMapStore();
  const [regionCityCounts, setRegionCityCounts] = useState<Record<
    string,
    number
  > | null>(null);

  useEffect(() => {
    fetch("/api/regions/counts")
      .then((res) => res.json())
      .then((data) => setRegionCityCounts(data))
      .catch((err) => console.error("Failed to fetch region counts", err));
  }, []);

  return (
    <Group x={369} y={664} scaleX={1} scaleY={1}>
      {regions.map(({ id, name }, index) => {
        const pathData = pathDataMap[id] || "";
        const isHovered = hoveredRegionId === id;
        const labelPos = regionLabelPositions[id] || { x: 0, y: 0 };
        const cityCount = regionCityCounts ? regionCityCounts[id] : -1;
        const isDisabled = mapType === "main" && cityCount === 0;

        if (!pathData) return null;

        return (
          <React.Fragment key={id}>
            <Path
              key={`path-${id}`}
              ref={(node) => assignPathRef(id, node)}
              data={pathData}
              fill={selectedRegion === id ? colors.primary : "white"}
              stroke={colors.primary}
              opacity={isDisabled ? 0.1 : 0.24}
              strokeWidth={2}
              listening={!isDisabled}
              onClick={() => handleRegionClick(id)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = "pointer";
                }
                // Use proper type assertion
                const path = e.target as Konva.Path;
                if (selectedRegion !== id) {
                  path.fill(colors.primaryHover);
                }
                const layer = path.getLayer();
                if (layer) {
                  layer.batchDraw();
                }

                setHoveredRegionId(id);
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

                setHoveredRegionId(null);
              }}
            />

            {/* Region label */}
            {selectedRegion !== id && (
              <Group
                key={`label-${id}`}
                x={labelPos.x}
                y={labelPos.y}
                scaleX={isHovered && !isDisabled ? 1.1 : 1}
                scaleY={isHovered && !isDisabled ? 1.1 : 1}
                opacity={isHovered && !isDisabled ? 1 : 0.9}
              >
                {/* Background for label */}
                <Rect
                  width={isDisabled ? 120 : 150}
                  height={44}
                  fill={"#ffffff"}
                  opacity={0.42}
                  cornerRadius={4}
                />

                {/* Region name */}
                <Text
                  text={name}
                  x={8}
                  y={16}
                  fontSize={14}
                  fontFamily="Arial"
                  fill={colors.primary}
                  fontWeight="bold"
                />

                {mapType === "main"
                  ? regionCityCounts &&
                    cityCount > 0 && (
                      <>
                        {/* Number circle */}
                        <Circle x={128} y={23} radius={14} fill="#ffffff" />

                        {/* Number text */}
                        <Text
                          text={cityCount.toString()}
                          x={128}
                          y={24}
                          fontSize={14}
                          fontFamily="Arial"
                          fill={colors.primary}
                          align="center"
                          verticalAlign="middle"
                          fontWeight="bold"
                          width={30}
                          height={30}
                          offsetX={15}
                          offsetY={15}
                        />
                      </>
                    )
                  : regionCityCounts && (
                      <>
                        {/* Number circle */}
                        <Circle x={128} y={23} radius={14} fill="#ffffff" />

                        {/* Number text */}
                        <Text
                          text={(index + 1).toString()}
                          x={128}
                          y={24}
                          fontSize={14}
                          fontFamily="Arial"
                          fill={colors.primary}
                          align="center"
                          verticalAlign="middle"
                          fontWeight="bold"
                          width={30}
                          height={30}
                          offsetX={15}
                          offsetY={15}
                        />
                      </>
                    )}
              </Group>
            )}
          </React.Fragment>
        );
      })}
    </Group>
  );
};

export default RegionsLayer;
