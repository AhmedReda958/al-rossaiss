import React, { useEffect, useRef } from "react";
import { Group, Line, Circle } from "react-konva";
import Konva from "konva";

import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import colors from "@/lib/colors";

const DrawingPolygon = () => {
  const { scale, position, zoomToPoint } = useMapStore();
  const {
    isDrawingMode,
    currentPoints,
    addPoint,
    updatePoint,
    deletePoint,
    pointsToFlatArray,
  } = usePolygonMarkerStore();

  const stageRef = useRef<Konva.Stage | null>(null);

  // useEffect(() => {
  //   if (currentPoints.length > 0) {
  //     zoomToPoint(currentPoints[0]);
  //   }
  // }, [currentPoints, zoomToPoint]);

  // Get the stage reference when component mounts
  useEffect(() => {
    // Find the Konva Stage element in the DOM
    const stage = document.querySelector("canvas")?.parentElement;
    if (stage) {
      // Get the Konva.Stage instance
      const konvaStage = Konva.stages[0];
      if (konvaStage) {
        stageRef.current = konvaStage;
      }
    }
  }, []);

  // Add click event listener to the stage
  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    const handleClick = () => {
      if (!isDrawingMode) return;

      const point = stage.getPointerPosition();

      if (!point) return;

      // Adjust for group transformation and stage position/scale
      const adjustedPoint = {
        x: (point.x - position.x) / scale,
        y: (point.y - position.y) / scale,
      };

      // Add to current points
      addPoint(adjustedPoint);
    };

    stage.on("click", handleClick);

    return () => {
      stage.off("click", handleClick);
    };
  }, [isDrawingMode, position, scale, addPoint]);

  return (
    <Group>
      {/* Display current drawing polygon */}
      {currentPoints.length > 0 && (
        <Line
          points={pointsToFlatArray(currentPoints)}
          fill={colors.primary_100}
          stroke={colors.primaryHover}
          strokeWidth={2}
          closed={currentPoints.length > 2}
        />
      )}

      {/* Display vertex points for the current polygon */}
      {currentPoints.map((point, index) => (
        <Circle
          key={`vertex-${index}`}
          x={point.x}
          y={point.y}
          radius={6}
          fill={colors.primaryHover}
          strokeWidth={2}
          draggable
          onDragMove={(e) => {
            updatePoint(index, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onClick={(e) => {
            // Stop event propagation to prevent adding a new point
            e.cancelBubble = true;
            if (e.evt.shiftKey) {
              deletePoint(index);
            }
          }}
        />
      ))}
    </Group>
  );
};

export default DrawingPolygon;
