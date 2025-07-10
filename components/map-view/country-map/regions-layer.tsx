import React, { useState, useEffect, useRef } from "react";
import { Group, Path, Text, Circle, Rect } from "react-konva";
import Konva from "konva";

import regions from "./regions";

import colors from "@/lib/colors";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";
import { useMapStore } from "@/lib/store/map-store";
import { useTranslations } from "next-intl";

// Define region positions for labels
const regionLabelPositions: Record<string, { x: number; y: number }> = {
  western: { x: 225, y: 322 },
  eastern: { x: 905, y: 372 },
  northern: { x: 325, y: 52 },
  southern: { x: 475, y: 572 },
  central: { x: 525, y: 272 },
};

// Animation configuration
const HOVER_ANIMATION_DURATION = 0.2;

const RegionsLayer = () => {
  const {
    pathDataMap,
    selectedRegion,
    setHoveredRegionId,
    handleRegionClick,
    assignPathRef,
  } = useRegionsLayer();
  const { mapType } = useMapStore();
  const tRegions = useTranslations("Regions");
  const [regionCityCounts, setRegionCityCounts] = useState<Record<
    string,
    number
  > | null>(null);

  const labelRefs = useRef<Record<string, Konva.Group>>({});

  useEffect(() => {
    fetch("/api/regions/counts")
      .then((res) => res.json())
      .then((data) => setRegionCityCounts(data))
      .catch((err) => console.error("Failed to fetch region counts", err));
  }, []);

  const animateLabel = (id: string, isHovered: boolean) => {
    requestAnimationFrame(() => {
      const labelNode = labelRefs.current[id];
      if (labelNode && labelNode.getStage()) {
        labelNode.to({
          scaleX: isHovered ? 1.1 : 1,
          scaleY: isHovered ? 1.1 : 1,
          opacity: isHovered ? 1 : 0.9,
          duration: HOVER_ANIMATION_DURATION,
          easing: Konva.Easings.EaseInOut,
        });
      }
    });
  };

  return (
    <Group x={369} y={664} scaleX={1} scaleY={1}>
      {regions.map(({ id }) => {
        const pathData = pathDataMap[id] || "";
        const labelPos = regionLabelPositions[id] || { x: 0, y: 0 };
        const cityCount = regionCityCounts ? regionCityCounts[id] : -1;

        // In edit-city mode, disable all regions except the currently selected one
        const isDisabled =
          mapType === "edit-city"
            ? selectedRegion !== id
            : cityCount === 0 && mapType === "main";

        // Get translated region name
        const translatedName = tRegions(id);

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
              onTap={() => handleRegionClick(id)}
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = "pointer";
                }
                const path = e.target as Konva.Path;
                if (selectedRegion !== id) {
                  path.to({
                    fill: colors.primaryHover,
                    duration: HOVER_ANIMATION_DURATION,
                    easing: Konva.Easings.EaseInOut,
                  });
                }
                animateLabel(id, true);
                setHoveredRegionId(id);
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) {
                  container.style.cursor = "default";
                }
                const path = e.target as Konva.Path;
                if (selectedRegion !== id) {
                  path.to({
                    fill: "white",
                    duration: HOVER_ANIMATION_DURATION,
                    easing: Konva.Easings.EaseInOut,
                  });
                }
                animateLabel(id, false);
                setHoveredRegionId(null);
              }}
            />

            {/* Region label */}
            {selectedRegion !== id && (
              <Group
                key={`label-${id}`}
                x={labelPos.x}
                y={labelPos.y}
                opacity={0.9}
                offset={{
                  x: (isDisabled ? 120 : 150) / 2,
                  y: 44 / 2,
                }}
                ref={(node) => {
                  if (node) {
                    labelRefs.current[id] = node;
                  }
                }}
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
                  text={translatedName}
                  x={8}
                  y={16}
                  fontSize={14}
                  fontFamily="Arial"
                  fill={colors.primary}
                  fontWeight="bold"
                />

                {regionCityCounts && cityCount > 0 && (
                  <>
                    {/* Number circle */}
                    <Circle x={130} y={23} radius={14} fill="#ffffff" />

                    {/* Number text */}
                    <Text
                      text={cityCount.toString()}
                      x={130}
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
