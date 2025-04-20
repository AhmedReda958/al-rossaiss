import React from "react";
import { Group, RegularPolygon } from "react-konva";
import Konva from "konva";

import { useMapStore } from "@/lib/store";
import colors from "@/lib/colors";
import { useCitiesLayer } from "@/lib/hooks/useCitiesLayer";

interface City {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  sides: number;
  rotation?: number;
}

interface CitiesData {
  [key: string]: City[];
}

// Define cities data with regular polygons per region
const citiesData: CitiesData = {
  western: [
    {
      id: "western-city-1",
      name: "Western City 1",
      x: 310,
      y: 550,
      radius: 20,
      sides: 6,
      rotation: 30,
    },
    {
      id: "western-city-2",
      name: "Western City 2",
      x: 280,
      y: 600,
      radius: 25,
      sides: 5,
    },
    {
      id: "western-city-3",
      name: "Western City 3",
      x: 370,
      y: 650,
      radius: 22,
      sides: 4,
      rotation: 45,
    },
  ],
  eastern: [
    {
      id: "eastern-city-1",
      name: "Eastern City 1",
      x: 850,
      y: 450,
      radius: 25,
      sides: 5,
    },
    {
      id: "eastern-city-2",
      name: "Eastern City 2",
      x: 810,
      y: 500,
      radius: 20,
      sides: 6,
      rotation: 15,
    },
  ],
  northern: [
    {
      id: "northern-city-1",
      name: "Northern City 1",
      x: 270,
      y: 80,
      radius: 24,
      sides: 8,
    },
    {
      id: "northern-city-2",
      name: "Northern City 2",
      x: 220,
      y: 130,
      radius: 18,
      sides: 5,
      rotation: 20,
    },
    {
      id: "northern-city-3",
      name: "Northern City 3",
      x: 320,
      y: 150,
      radius: 28,
      sides: 3,
      rotation: 10,
    },
  ],
  southern: [
    {
      id: "southern-city-1",
      name: "Southern City 1",
      x: 520,
      y: 800,
      radius: 30,
      sides: 4,
    },
    {
      id: "southern-city-2",
      name: "Southern City 2",
      x: 470,
      y: 850,
      radius: 22,
      sides: 6,
      rotation: 40,
    },
  ],
  central: [
    {
      id: "central-city-1",
      name: "Central City 1",
      x: 520,
      y: 400,
      radius: 28,
      sides: 5,
    },
    {
      id: "central-city-2",
      name: "Central City 2",
      x: 470,
      y: 450,
      radius: 22,
      sides: 6,
      rotation: 25,
    },
    {
      id: "central-city-3",
      name: "Central City 3",
      x: 570,
      y: 450,
      radius: 25,
      sides: 8,
      rotation: 12,
    },
  ],
};

const CitiesLayer = () => {
  const { selectedRegion } = useMapStore();
  const { hoveredCityId, setHoveredCityId } = useCitiesLayer();

  // Only show cities for the selected region
  const visibleCities = selectedRegion ? citiesData[selectedRegion] || [] : [];

  return (
    <Group x={120} y={0} scaleX={0.95} scaleY={0.95}>
      {visibleCities.map((city: City) => {
        const isHovered = hoveredCityId === city.id;

        return (
          <RegularPolygon
            key={city.id}
            x={city.x}
            y={city.y}
            sides={city.sides}
            radius={city.radius}
            fill={isHovered ? colors.primaryHover : colors.secondary}
            stroke={colors.primary}
            strokeWidth={2}
            opacity={isHovered ? 0.8 : 0.5}
            rotation={city.rotation || 0}
            shadowColor="black"
            shadowBlur={isHovered ? 10 : 0}
            shadowOpacity={0.3}
            perfectDrawEnabled={true}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = "pointer";
              }
              const shape = e.target as Konva.RegularPolygon;
              shape.fill(colors.primaryHover);
              shape.shadowBlur(10);
              const layer = shape.getLayer();
              if (layer) {
                layer.batchDraw();
              }
              setHoveredCityId(city.id);
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) {
                container.style.cursor = "default";
              }
              const shape = e.target as Konva.RegularPolygon;
              shape.fill(colors.secondary);
              shape.shadowBlur(0);
              const layer = shape.getLayer();
              if (layer) {
                layer.batchDraw();
              }
              setHoveredCityId(null);
            }}
            onClick={() => {
              console.log(`City clicked: ${city.name}`);
              // Handle city click, e.g., show city details
            }}
          />
        );
      })}
    </Group>
  );
};

export default CitiesLayer;
