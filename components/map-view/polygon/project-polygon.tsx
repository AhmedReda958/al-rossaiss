import colors from "@/lib/colors";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Line, Group, Text, Image, Rect } from "react-konva";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { useMapStore } from "@/lib/store";
import { Tween, Easings } from "konva/lib/Tween";
import Konva from "konva";
import { group } from "console";

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
  renderMode = "full",
}: {
  polygon: CityPolygon;
  fillColor?: string;
  strokeColor?: string;
  logoUrl?: string | null;
  renderMode?: "full" | "polygon" | "label";
}) => {
  const { setSelectedProject, selectedProject } = useMapStore();
  const polygonRef = useRef<Konva.Line>(null);
  const logoRef = useRef<Konva.Image>(null);
  const logoRectRef = useRef<Konva.Rect>(null);
  const defaultLogoRectRef = useRef<Konva.Rect>(null);
  const logoGroupRef = useRef<Konva.Group>(null);
  const tooltipGroupRef = useRef<Konva.Group>(null);
  const currentTween = useRef<Tween | null>(null);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [defaultLogoImage, setDefaultLogoImage] =
    useState<HTMLImageElement | null>(null);

  // Check if this project is selected or if any project is selected
  const isThisProjectSelected = selectedProject === parseInt(polygon.id, 10);
  const isAnyProjectSelected = selectedProject !== null;

  // Calculate opacity based on selection state
  const getOpacity = useCallback(() => {
    if (!isAnyProjectSelected) return 1; // Default opacity when no selection
    if (isThisProjectSelected) return 1; // Full opacity for selected project
    return 0.3; // Reduced opacity for non-selected projects when something is selected
  }, [isAnyProjectSelected, isThisProjectSelected]);

  const baseOpacity = getOpacity();

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

  const handlePolygonClick = (e?: Konva.KonvaEventObject<Event>) => {
    // Prevent event propagation to avoid triggering background click
    if (e) {
      e.cancelBubble = true;
    }
    setSelectedProject(parseInt(polygon.id, 10));

    // Zoom to the project polygon with dynamic scaling
    // Get the layer that this polygon is actually on
    const polygonLayer = polygonRef.current?.getLayer();
    if (polygonLayer) {
      const { zoomToPolygon } = useMapStore.getState();
      // Temporarily override the layer reference for this zoom operation
      const originalLayerRef = useMapStore.getState().layerRef;
      useMapStore.setState({ layerRef: { current: polygonLayer } });
      zoomToPolygon(polygon.points);
      // Restore the original layer reference after a short delay
      setTimeout(() => {
        useMapStore.setState({ layerRef: originalLayerRef });
      }, 700); // Slightly longer than the zoom animation duration
    }
  };

  const animateTooltip = (show: boolean) => {
    requestAnimationFrame(() => {
      const tooltipNode = tooltipGroupRef.current;
      if (tooltipNode && tooltipNode.getStage()) {
        tooltipNode.to({
          opacity: show ? 1 : 0,
          scaleX: show ? 1 : 0,
          scaleY: 1,
          duration: 0.2,
          easing: Konva.Easings.EaseInOut,
        });
      }

      // Animate main logo border radius
      const logoRect = logoRectRef.current || defaultLogoRectRef.current;
      if (logoRect && logoRect.getStage()) {
        logoRect.to({
          cornerRadius: show ? [12, 0, 0, 12] : [12, 12, 12, 12],
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

    // Animate polygon opacity - increase from base opacity
    if (polygonRef.current) {
      currentTween.current = new Tween({
        node: polygonRef.current,
        duration: 0.2,
        easing: Easings.EaseInOut,
        opacity: Math.min(baseOpacity, 1), // Increase opacity on hover but cap at 1
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

    // Animate polygon opacity back to base opacity
    if (polygonRef.current) {
      currentTween.current = new Tween({
        node: polygonRef.current,
        duration: 0.2,
        easing: Easings.EaseInOut,
        opacity: baseOpacity,
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

  // Update opacity when selection changes
  useEffect(() => {
    if (polygonRef.current) {
      const newOpacity = getOpacity();
      polygonRef.current.to({
        opacity: newOpacity,
        duration: 0.3,
        easing: Konva.Easings.EaseInOut,
      });
    }

    if (logoGroupRef.current) {
      const newOpacity = getOpacity();
      logoGroupRef.current.to({
        opacity: newOpacity,
        duration: 0.3,
        easing: Konva.Easings.EaseInOut,
      });
    }
  }, [selectedProject, polygon.id, getOpacity]);

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
  const logoSize = 50;

  // Tooltip dimensions (similar to landmark pin)
  const tooltipPadding = 12;
  const tooltipHeight = 36;
  const tooltipWidth = Math.max(
    polygon.name.length * 8 + tooltipPadding * 2,
    80
  );
  const tooltipX = logoSize - 3; // Position to the right of the logo
  const tooltipY = 0; // Center vertically with the logo

  return (
    <Group>
      {/* Render polygon and connecting line only in polygon or full mode */}
      {(renderMode === "polygon" || renderMode === "full") && (
        <>
          {/* Polygon */}
          <Line
            ref={polygonRef}
            key={polygon.id}
            points={polygon.points}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1}
            opacity={baseOpacity}
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
            <Line
              points={linePoints}
              stroke={strokeColor}
              strokeWidth={1}
              opacity={baseOpacity - 0.2}
            />
          )}
        </>
      )}

      {/* Render logo/label only in label or full mode */}
      {(renderMode === "label" || renderMode === "full") && (
        <Group
          ref={logoGroupRef}
          x={labelPos.x - logoSize / 2}
          y={labelPos.y - logoSize / 2}
          opacity={baseOpacity}
          onClick={handlePolygonClick}
          onTap={handlePolygonClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          listening={true}
          cursor="pointer"
        >
          {logoUrl && logoImage ? (
            <Group>
              <Rect
                ref={logoRectRef}
                width={logoSize}
                height={logoSize}
                fill="white"
                cornerRadius={[12, 12, 12, 12]}
              />
              <Image
                ref={logoRef}
                image={logoImage}
                width={logoSize * 0.8}
                height={logoSize * 0.8}
                x={logoSize * 0.1}
                y={logoSize * 0.1}
                alt="Project Logo"
              />
            </Group>
          ) : (
            // Default logo (website logo)
            <Group>
              <Rect
                ref={defaultLogoRectRef}
                width={logoSize}
                height={logoSize}
                fill="white"
                cornerRadius={[12, 12, 12, 12]}
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
            y={tooltipY + 0.5}
            opacity={0}
          >
            <Rect
              width={tooltipWidth}
              height={logoSize - 1}
              fill={"white"}
              cornerRadius={[0, 12, 12, 0]}
              shadowColor="white"
              shadowBlur={10}
              shadowOffsetX={2}
              shadowOffsetY={2}
              shadowOpacity={0.1}
              stroke={"white"}
              strokeWidth={1}
            />
            {/* Tooltip text */}
            <Text
              text={polygon.name}
              fontSize={12}
              fontStyle="bold"
              fill={colors.primary}
              x={10}
              height={logoSize}
              align="center"
              verticalAlign="middle"
            />
          </Group>
        </Group>
      )}
    </Group>
  );
};

export default ProjectPolygon;
