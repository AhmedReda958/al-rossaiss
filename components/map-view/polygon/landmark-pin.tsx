"use client";

import React from "react";
import { Group, Circle, Line } from "react-konva";
import { LANDMARK_TYPES, LandmarkType } from "@/lib/constants";

// Define colors for different landmark types
const LANDMARK_COLORS = {
  [LANDMARK_TYPES.LANDMARK]: "#757575", // Gray
  [LANDMARK_TYPES.SHOP]: "#EA4335", // Red
  [LANDMARK_TYPES.EDUCATION]: "#4285F4", // Blue
  [LANDMARK_TYPES.HOSPITAL]: "#34A853", // Green
  [LANDMARK_TYPES.PARK]: "#0F9D58", // Dark Green
  [LANDMARK_TYPES.MOSQUE]: "#AA00FF", // Purple
  default: "#757575", // Gray
} as const;

interface LandmarkPinProps {
  x: number;
  y: number;
  type: LandmarkType;
  size?: number;
  onClick?: () => void;
}

const LandmarkPin = ({ x, y, type, size = 30, onClick }: LandmarkPinProps) => {
  const color = LANDMARK_COLORS[type] || LANDMARK_COLORS.default;
  const pinWidth = size * 0.7;

  return (
    <Group x={x} y={y} onClick={onClick}>
      {/* Pin Circle */}
      <Circle radius={size / 2} fill={color} stroke="#ffffff" strokeWidth={2} />

      {/* Pin Bottom Triangle */}
      <Line
        points={[
          -pinWidth / 2,
          0, // Left point
          0,
          size * 0.8, // Bottom point
          pinWidth / 2,
          0, // Right point
        ]}
        closed={true}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
      />

      {/* Icon placeholder - you can add specific icons based on type */}
      <Circle radius={size / 4} fill="#ffffff" stroke={color} strokeWidth={1} />
    </Group>
  );
};

export default LandmarkPin;
