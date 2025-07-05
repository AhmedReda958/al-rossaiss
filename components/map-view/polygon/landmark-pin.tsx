"use client";

import React, { useState, useRef } from "react";
import { Group, Circle, Line, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { LANDMARK_TYPES, LandmarkType } from "@/lib/constants";
import { LandmarkIcon, GraduationCap, Hospital, TreePine } from "lucide-react";
import { MdMosque } from "react-icons/md";
import { IoBagHandle } from "react-icons/io5";
import Konva from "konva";

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

// Animation configuration
const HOVER_ANIMATION_DURATION = 0.2;

interface LandmarkPinProps {
  x: number;
  y: number;
  type: LandmarkType;
  name?: string;
  size?: number;
  onClick?: () => void;
}

const LandmarkPin = ({
  x,
  y,
  type,
  name = "",
  size = 30,
  onClick,
}: LandmarkPinProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipGroupRef = useRef<Konva.Group>(null);

  const color = LANDMARK_COLORS[type] || LANDMARK_COLORS.default;
  const pinWidth = size * 0.7;
  const IconComponent = getLandmarkIcon(type);

  // Calculate tooltip dimensions
  const tooltipPadding = size / 3; // Dynamic padding based on size
  const tooltipHeight = size / 1.1;
  const tooltipWidth = Math.max(name.length * 8 + tooltipPadding * 2, 30);
  const tooltipX = size / 2 + 10; // Position to the right of the circle
  const tooltipY = -tooltipHeight / 2; // Center vertically with the circle

  const animateTooltip = (isHovered: boolean) => {
    requestAnimationFrame(() => {
      const tooltipNode = tooltipGroupRef.current;
      if (tooltipNode && tooltipNode.getStage()) {
        tooltipNode.to({
          x: isHovered ? tooltipX : tooltipX - 20,
          y: tooltipY,
          scaleX: isHovered ? 1 : 0.8,
          scaleY: isHovered ? 1 : 0.8,
          opacity: isHovered ? 1 : 0,
          duration: HOVER_ANIMATION_DURATION,
          easing: Konva.Easings.EaseInOut,
        });
      }
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    animateTooltip(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    animateTooltip(false);
  };

  return (
    <Group
      x={x}
      y={y}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      {/* Tooltip Box - Animated with requestAnimationFrame */}
      <Group
        ref={tooltipGroupRef}
        x={tooltipX}
        y={tooltipY}
        scaleX={0.8}
        scaleY={0.8}
        opacity={0}
        visible={isHovered && name.length > 0}
      >
        {/* Tooltip Background */}
        <Rect
          width={tooltipWidth}
          height={tooltipHeight}
          fill={color}
          cornerRadius={size / 2}
        />

        {/* Tooltip Text */}
        <Text
          text={name}
          x={tooltipPadding}
          y={tooltipPadding}
          fontSize={12}
          fill="white"
          fontFamily="Arial, sans-serif"
          fontStyle="bold"
        />
      </Group>

      {/* Icon */}
      <Html
        divProps={{
          style: {
            pointerEvents: "none",
          },
        }}
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
