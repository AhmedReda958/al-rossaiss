import colors from "@/lib/colors";
import React, { useRef, useEffect, useState } from "react";
import { Line, Group, Text, Image, Circle, Rect } from "react-konva";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { useMapStore } from "@/lib/store";
import { Tween, Easings } from "konva/lib/Tween";
import Konva from "konva";

const getPolygonCenter = (points: number[]) => {
  let x = 0;
  let y = 0;
  for (let i = 0; i < points.length; i += 2) {
    x += points[i];
    y += points[i + 1];
  }
  return {
    x: x / (points.length / 2),
    y: y / (points.length / 2),
  };
};

const getEdgePoint = (points: number[], direction: string) => {
  const polygonPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    polygonPoints.push({ x: points[i], y: points[i + 1] });
  }

  switch (direction) {
    case "up":
      return polygonPoints.reduce((topmost, current) =>
        current.y < topmost.y ? current : topmost
      );
    case "down":
      return polygonPoints.reduce((bottommost, current) =>
        current.y > bottommost.y ? current : bottommost
      );
    case "left":
      return polygonPoints.reduce((leftmost, current) =>
        current.x < leftmost.x ? current : leftmost
      );
    case "right":
      return polygonPoints.reduce((rightmost, current) =>
        current.x > rightmost.x ? current : rightmost
      );
    default:
      const center = getPolygonCenter(points);
      return center;
  }
};

const ProjectPolygon = ({
  polygon,
  fillColor = colors.primary_400,
  strokeColor = colors.primary,
  logoUrl,
}: {
  polygon: CityPolygon;
  fillColor?: string;
  strokeColor?: string;
  logoUrl?: string | null;
}) => {
  const { setSelectedProject } = useMapStore();
  const polygonRef = useRef<Konva.Line>(null);
  const textRef = useRef<Konva.Text>(null);
  const logoRef = useRef<Konva.Image>(null);
  const logoGroupRef = useRef<Konva.Group>(null);
  const tooltipGroupRef = useRef<Konva.Group>(null);
  const currentTween = useRef<Tween | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [defaultLogoImage, setDefaultLogoImage] =
    useState<HTMLImageElement | null>(null);

  // Load default logo image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setDefaultLogoImage(img);
    };
    img.src = "/logo.svg";
  }, []);

  // Load logo image if logoUrl is provided
  useEffect(() => {
    if (logoUrl) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setLogoImage(img);
      };
      img.src = logoUrl;
    } else {
      setLogoImage(null);
    }
  }, [logoUrl]);

  const handlePolygonClick = () => {
    setSelectedProject(parseInt(polygon.id, 10));
  };

  const animateTooltip = (show: boolean) => {
    requestAnimationFrame(() => {
      const tooltipNode = tooltipGroupRef.current;
      if (tooltipNode && tooltipNode.getStage()) {
        tooltipNode.to({
          opacity: show ? 1 : 0,
          scaleX: show ? 1 : 0.8,
          scaleY: show ? 1 : 0.8,
          duration: 0.2,
          easing: Konva.Easings.EaseInOut,
        });
      }
    });
  };

  const handleMouseEnter = () => {
    // Stop any existing tween
    if (currentTween.current) {
      currentTween.current.destroy();
    }

    // Animate polygon opacity
    if (polygonRef.current) {
      currentTween.current = new Tween({
        node: polygonRef.current,
        duration: 0.2,
        easing: Easings.EaseInOut,
        opacity: 1,
      });
      currentTween.current.play();
    }

    // Show tooltip
    animateTooltip(true);
  };

  const handleMouseLeave = () => {
    // Stop any existing tween
    if (currentTween.current) {
      currentTween.current.destroy();
    }

    // Animate polygon opacity back
    if (polygonRef.current) {
      currentTween.current = new Tween({
        node: polygonRef.current,
        duration: 0.2,
        easing: Easings.EaseInOut,
        opacity: 0.7,
      });
      currentTween.current.play();
    }

    // Hide tooltip
    animateTooltip(false);
  };

  // Cleanup tweens on unmount
  useEffect(() => {
    return () => {
      if (currentTween.current) {
        currentTween.current.destroy();
      }
    };
  }, []);

  const center = getPolygonCenter(polygon.points);
  const edgePoint = getEdgePoint(polygon.points, polygon.labelDirection || "");
  const labelOffset = 50;
  let labelPos = { x: 0, y: 0 };
  let linePoints: number[] = [];

  // Calculate label position and connecting line based on direction (same as city polygon)
  switch (polygon.labelDirection) {
    case "up":
      labelPos = { x: edgePoint.x, y: edgePoint.y - labelOffset };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x,
        edgePoint.y - labelOffset,
      ];
      break;
    case "down":
      labelPos = { x: edgePoint.x, y: edgePoint.y + labelOffset };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x,
        edgePoint.y + labelOffset,
      ];
      break;
    case "left":
      labelPos = { x: edgePoint.x - labelOffset, y: edgePoint.y };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x - labelOffset,
        edgePoint.y,
      ];
      break;
    case "right":
      labelPos = { x: edgePoint.x + labelOffset, y: edgePoint.y };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x + labelOffset,
        edgePoint.y,
      ];
      break;
    default:
      labelPos = { x: center.x - 35, y: center.y - 10 };
      linePoints = [];
      break;
  }

  // Logo dimensions
  const logoSize = 40;
  const logoX = center.x - logoSize / 2;
  const logoY = center.y - logoSize / 2;

  // Tooltip dimensions (similar to landmark pin)
  const tooltipPadding = 8;
  const tooltipHeight = 25;
  const tooltipWidth = Math.max(
    polygon.name.length * 8 + tooltipPadding * 2,
    80
  );
  const tooltipX = logoSize / 2 + 10; // Position to the right of the logo
  const tooltipY = -tooltipHeight / 2; // Center vertically with the logo

  return (
    <Group>
      {/* Polygon */}
      <Line
        ref={polygonRef}
        key={polygon.id}
        points={polygon.points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={1}
        opacity={0.7}
        closed={true}
        onClick={handlePolygonClick}
        onTap={handlePolygonClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        listening={true}
        cursor="pointer"
      />

      {/* Connecting line from polygon to label (if labelDirection is set) */}
      {linePoints.length > 0 && (
        <Line points={linePoints} stroke={strokeColor} strokeWidth={1} />
      )}

      {/* Label with project name (positioned outside polygon based on labelDirection) */}
      {polygon.labelDirection && (
        <Group x={labelPos.x} y={labelPos.y}>
          <Text
            ref={textRef}
            text={polygon.name}
            fontSize={12}
            fontStyle="bold"
            fill={strokeColor}
            width={70}
            align="center"
            verticalAlign="middle"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            listening={true}
            cursor="pointer"
          />
        </Group>
      )}

      {/* Logo or Default Icon */}
      <Group
        ref={logoGroupRef}
        x={logoX}
        y={logoY}
        onClick={handlePolygonClick}
        onTap={handlePolygonClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        listening={true}
        cursor="pointer"
      >
        {logoUrl && logoImage ? (
          <Image
            ref={logoRef}
            image={logoImage}
            width={logoSize}
            height={logoSize}
            cornerRadius={logoSize / 2}
            alt="Project Logo"
          />
        ) : (
          // Default logo (website logo)
          <Group>
            <Circle
              radius={logoSize / 2}
              fill="white"
              stroke={strokeColor}
              strokeWidth={2}
            />
            {defaultLogoImage && (
              <Image
                image={defaultLogoImage}
                width={logoSize * 0.6}
                height={logoSize * 0.6}
                x={logoSize * 0.2}
                y={logoSize * 0.2}
                alt="Default Logo"
              />
            )}
          </Group>
        )}

        {/* Tooltip with project name - positioned like landmark tooltip */}
        <Group
          ref={tooltipGroupRef}
          x={tooltipX}
          y={tooltipY}
          opacity={0}
          scaleX={0.8}
          scaleY={0.8}
        >
          <Rect
            width={tooltipWidth}
            height={tooltipHeight}
            fill={colors.primary}
            cornerRadius={5}
            shadowColor="black"
            shadowBlur={10}
            shadowOffsetX={2}
            shadowOffsetY={2}
            shadowOpacity={0.5}
            stroke={colors.primary}
            strokeWidth={1}
          />
          {/* Tooltip text */}
          <Text
            text={polygon.name}
            fontSize={12}
            fontStyle="bold"
            fill="white"
            x={tooltipPadding}
            y={6}
            width={tooltipWidth - tooltipPadding * 2}
            align="center"
            verticalAlign="middle"
          />
        </Group>
      </Group>
    </Group>
  );
};

export default ProjectPolygon;
