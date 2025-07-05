"use client";

import React from "react";
import { Group, Circle, Line } from "react-konva";
import { Html } from "react-konva-utils";
import { LANDMARK_TYPES, LandmarkType } from "@/lib/constants";
import { LandmarkIcon, GraduationCap, Hospital, TreePine } from "lucide-react";
import { MdMosque } from "react-icons/md";
import { IoBagHandle } from "react-icons/io5";

// Define colors for different landmark types
const LANDMARK_COLORS = {
  [LANDMARK_TYPES.LANDMARK]: "#2F80ED", // blue
  [LANDMARK_TYPES.SHOP]: "#ED912F", // Red
  [LANDMARK_TYPES.EDUCATION]: "#ED2FE7", // Pink
  [LANDMARK_TYPES.HOSPITAL]: "#ED2F38", // Green
  [LANDMARK_TYPES.PARK]: "#219653", // Green
  [LANDMARK_TYPES.MOSQUE]: "#EDD42F", // yellow
  default: "#757575", // Gray
} as const;

// Function to get the appropriate icon based on landmark type
const getLandmarkIcon = (type: LandmarkType) => {
  switch (type) {
    case LANDMARK_TYPES.SHOP:
      return IoBagHandle;
    case LANDMARK_TYPES.EDUCATION:
      return GraduationCap;
    case LANDMARK_TYPES.HOSPITAL:
      return Hospital;
    case LANDMARK_TYPES.PARK:
      return TreePine;
    case LANDMARK_TYPES.MOSQUE:
      return MdMosque;
    case LANDMARK_TYPES.LANDMARK:
    default:
      return LandmarkIcon;
  }
};

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
  const IconComponent = getLandmarkIcon(type);

  return (
    <Group x={x} y={y} onClick={onClick}>
      {/* Pin Circle */}
      <Circle radius={size / 2} fill={color} />

      {/* Pin Bottom Triangle */}
      <Line
        points={[
          -pinWidth / 3,
          0, // Left point
          0,
          size * 0.35, // Bottom point
          pinWidth / 3,
          0, // Right point
        ]}
        y={size * 0.3}
        closed={true}
        fill={color}
      />
      <Html
        transformFunc={(attrs) => {
          return {
            ...attrs,
            x: attrs.x - size / 4,
            y: attrs.y - size / 4,
          };
        }}
      >
        <IconComponent color={"#ffffff"} size={size / 2} strokeWidth={2.5} />
      </Html>
    </Group>
  );
};

export default LandmarkPin;
