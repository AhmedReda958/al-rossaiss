"use client";

import React, { useRef } from "react";
import { Group, Text, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import colors from "@/lib/colors";

interface CustomLandmarkLogoProps {
  x: number;
  y: number;
  name?: string;
  imageUrl: string;
  size?: number;
  onClick?: () => void;
}

const CustomLandmarkLogo = ({
  x,
  y,
  name = "",
  imageUrl,
  size = 40,
}: CustomLandmarkLogoProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const [image] = useImage(imageUrl, "anonymous");

  // Calculate text dimensions
  const textPadding = 4;
  const textHeight = 16;
  const textWidth = Math.max(name.length * 8 + textPadding * 2, size);

  return (
    <Group ref={groupRef} x={x} y={y}>
      {image && (
        <KonvaImage
          image={image}
          x={-size / 2 + 4}
          y={-size / 2 + 4}
          width={size - 8}
          height={size - 8}
          cornerRadius={4}
        />
      )}

      {/* Name Label Text */}
      {name && (
        <Text
          text={name}
          x={-textWidth / 2 + textPadding}
          y={size / 2 + 9}
          fontSize={14}
          fill={colors.primary}
          fontFamily="inter, sans-serif"
          fontStyle="bold"
          width={textWidth - textPadding * 2}
          align="center"
          ellipsis={true}
        />
      )}
    </Group>
  );
};

export default CustomLandmarkLogo;
