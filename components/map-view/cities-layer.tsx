"use client";

import React from "react";
import { Group, Path, Text } from "react-konva";
import { useMapStore, City } from "@/lib/store";
import colors from "@/lib/colors";

const pointsToPath = (points: number[]) => {
  if (points.length < 2) return "";
  const path = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point} ${points[i + 1]}`;
    if (i % 2 === 0) return `${acc} L ${point} ${points[i + 1]}`;
    return acc;
  }, "");
  return `${path} Z`; // Close the path to form a polygon
};

const getLabelPosition = (city: City) => {
  const bounds = {
    x: Math.min(...city.points.filter((_, i) => i % 2 === 0)),
    y: Math.min(...city.points.filter((_, i) => i % 2 !== 0)),
    width:
      Math.max(...city.points.filter((_, i) => i % 2 === 0)) -
      Math.min(...city.points.filter((_, i) => i % 2 === 0)),
    height:
      Math.max(...city.points.filter((_, i) => i % 2 !== 0)) -
      Math.min(...city.points.filter((_, i) => i % 2 !== 0)),
  };

  switch (city.labelDirection) {
    case "top":
      return { x: bounds.x + bounds.width / 2, y: bounds.y - 20 };
    case "bottom":
      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height + 10,
      };
    case "left":
      return { x: bounds.x - 50, y: bounds.y + bounds.height / 2 };
    case "right":
      return {
        x: bounds.x + bounds.width + 10,
        y: bounds.y + bounds.height / 2,
      };
    default:
      return {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      };
  }
};

const CitiesLayer = () => {
  const { cities } = useMapStore();

  if (!cities.length) {
    return null;
  }

  return (
    <Group>
      {cities.map((city) => (
        <React.Fragment key={city.id}>
          <Path
            data={pointsToPath(city.points)}
            fill={colors.primary}
            opacity={0.5}
            stroke={colors.primary}
            strokeWidth={1}
          />
          <Text
            text={city.name}
            x={getLabelPosition(city).x}
            y={getLabelPosition(city).y}
            fontSize={14}
            fill="black"
            align="center"
            verticalAlign="middle"
          />
        </React.Fragment>
      ))}
    </Group>
  );
};

export default CitiesLayer;
