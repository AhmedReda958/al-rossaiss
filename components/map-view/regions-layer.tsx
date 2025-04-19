import React, { useEffect, useState } from "react";
import { Group, Path, Image, Layer, Text, Circle, Rect } from "react-konva";
import Konva from "konva";
import { renderToStaticMarkup } from "react-dom/server";
import regions from "./reigons";
import useImage from "use-image";
import colors from "@/lib/colors";
interface RegionsLayerProps {
  stageSize: {
    width: number;
    height: number;
  };
  selectedRegion: string | null;
  onRegionClick: (id: string) => void;
}

// Define region positions for labels
const regionLabelPositions: Record<string, { x: number; y: number }> = {
  western: { x: 280, y: 600 },
  eastern: { x: 830, y: 500 },
  northern: { x: 250, y: 80 },
  southern: { x: 500, y: 850 },
  central: { x: 500, y: 450 },
};

const RegionsLayer: React.FC<RegionsLayerProps> = ({
  stageSize,
  selectedRegion,
  onRegionClick,
}) => {
  const [pathDataMap, setPathDataMap] = useState<Record<string, string>>({});
  const [mapImage] = useImage("/map.png");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

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

  return (
    <Layer>
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
      <Group x={120} y={0} scaleX={0.95} scaleY={0.95}>
        {regions.map(({ id, name }, index) => {
          const pathData = pathDataMap[id] || "";
          const isHovered = hoveredRegionId === id;
          const labelPos = regionLabelPositions[id] || { x: 0, y: 0 };

          if (!pathData) return null;

          return (
            <>
              <Path
                data={pathData}
                fill={selectedRegion === id ? colors.primary : "white"}
                stroke={selectedRegion === id ? colors.primary : "#5E8894"}
                strokeWidth={selectedRegion === id ? 2 : 1}
                onClick={() => onRegionClick(id)}
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
              <Group
                x={labelPos.x}
                y={labelPos.y}
                scaleX={isHovered ? 1.1 : 1}
                scaleY={isHovered ? 1.1 : 1}
                opacity={isHovered ? 1 : 0.9}
                zIndex={1000}
              >
                {/* Background for label */}
                <Rect
                  width={177}
                  height={52}
                  fill={isHovered ? "#ffffff" : colors.secondary}
                  opacity={0.16}
                  cornerRadius={4}
                />

                {/* Region name */}
                <Text
                  text={name}
                  x={14}
                  y={18}
                  fontSize={16}
                  fontFamily="Arial"
                  fill={colors.primary}
                  fontWeight="bold"
                />

                {/* Number circle */}
                <Circle x={153} y={26} radius={15} fill="#ffffff" />

                {/* Number text */}
                <Text
                  text={(index + 1).toString()}
                  x={153}
                  y={26}
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
              </Group>
            </>
          );
        })}
      </Group>
    </Layer>
  );
};

export default RegionsLayer;
