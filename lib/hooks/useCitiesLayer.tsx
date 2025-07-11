import { useRef, useCallback, useLayoutEffect } from "react";
import Konva from "konva";
import { useMapStore } from "@/lib/store";

/**
 * Custom hook to manage the cities layer state, including hover, selection, and drag boundaries (no scale)
 */
export const useCitiesLayer = () => {
  const layerRef = useRef<Konva.Layer>(null);
  const { selectedCity, setSelectedCity, mapSize, isZooming, setLayerRef } =
    useMapStore();

  // Set the layer reference in the store
  useLayoutEffect(() => {
    if (layerRef.current) {
      setLayerRef({ current: layerRef.current });
    }
  }, [setLayerRef]);

  const effectiveMapWidth = mapSize.width;
  const effectiveMapHeight = mapSize.height;

  // Calculate position based on screen size instead of image size
  const getPosition = useCallback(() => {
    const stage = layerRef.current?.getStage();
    if (!stage) {
      return { x: 0, y: 0 };
    }
    
    const stageWidth = stage.width();
    const stageHeight = stage.height();
    
    // Center the map on the screen
    return {
      x: (stageWidth - effectiveMapWidth) / 2,
      y: (stageHeight - effectiveMapHeight) / 2,
    };
  }, [effectiveMapWidth, effectiveMapHeight]);

  const position = getPosition();

  // Drag boundaries for the city map (no scale)
  const limitDragBoundaries = useCallback(
    (pos: { x: number; y: number }) => {
      if (isZooming) return pos;
      const stage = layerRef.current?.getStage();
      if (!stage) return pos;
      const stageWidth = stage.width();
      const stageHeight = stage.height();
      const xMin = Math.min(0, stageWidth - effectiveMapWidth);
      const yMin = Math.min(0, stageHeight - effectiveMapHeight);
      return {
        x: Math.max(xMin, Math.min(0, pos.x)),
        y: Math.max(yMin, Math.min(0, pos.y)),
      };
    },
    [effectiveMapWidth, effectiveMapHeight, isZooming]
  );

  return {
    layerRef,
    selectedCity,
    setSelectedCity,
    effectiveMapWidth,
    effectiveMapHeight,
    position,
    limitDragBoundaries,
  };
};
